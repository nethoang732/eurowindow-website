'use client';

import { useEffect } from 'react';
import { animate, stagger, useReducedMotion } from 'motion/react';

const SPRING = { type: 'spring', stiffness: 230, damping: 29, mass: 0.85 };

function readTranslateX(element) {
  const transform = window.getComputedStyle(element).transform;
  return transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41;
}

function setupCarousel(section, reduceMotion) {
  const track = section.querySelector('.system-track');
  const viewport = section.querySelector('.system-marquee');
  const previous = section.querySelector('[data-system-prev]');
  const next = section.querySelector('[data-system-next]');
  const pause = section.querySelector('.system-marquee-control');
  if (!track || !viewport || !previous || !next || !pause) return null;

  const originals = [...track.children].filter((card) => card.getAttribute('aria-hidden') !== 'true');
  if (originals.length !== 5) return null;

  const clones = originals.map((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.setAttribute('inert', '');
    clone.classList.remove('is-active', 'reveal', 'visible', 'home-motion-item', 'home-motion-visible');
    clone.querySelectorAll('a,button,[tabindex]').forEach((item) => { item.tabIndex = -1; });
    clone.querySelectorAll('a,img').forEach((item) => { item.draggable = false; });
    return clone;
  });
  originals.forEach((card) => card.querySelectorAll('a,img').forEach((item) => { item.draggable = false; }));
  track.replaceChildren(...clones, ...originals, ...clones.map((card) => card.cloneNode(true)));

  let cycleWidth = 0;
  let x = 0;
  let activeIndex = window.matchMedia('(min-width: 701px)').matches ? 2 : 0;
  let timer = 0;
  let inView = false;
  let isPaused = false;
  let drag = null;
  let suppressClick = false;
  let currentAnimation = null;
  let revealAnimation = null;
  let revealObserver = null;
  let resizeObserver = null;
  let disposed = false;
  const springAnimations = new Set();

  const animateElement = (element, keyframes, options) => {
    const playback = animate(element, keyframes, options);
    springAnimations.add(playback);
    playback.then(() => springAnimations.delete(playback)).catch(() => springAnimations.delete(playback));
    return playback;
  };

  const gap = () => parseFloat(window.getComputedStyle(track).gap) || 0;
  const measure = () => {
    cycleWidth = originals.reduce((total, card) => total + card.getBoundingClientRect().width, 0) + gap() * originals.length;
    return cycleWidth;
  };
  const cardStep = () => (originals[0]?.getBoundingClientRect().width || 0) + gap();
  const wrapX = (value) => {
    if (!cycleWidth) return value;
    while (value > 0) value -= cycleWidth;
    while (value <= -2 * cycleWidth) value += cycleWidth;
    return value;
  };
  const setActiveCard = (index, animateChange = true) => {
    activeIndex = (index + originals.length) % originals.length;
    originals.forEach((card, cardIndex) => {
      const active = cardIndex === activeIndex;
      const link = card.querySelector(':scope > a');
      const fromColor = link ? window.getComputedStyle(link).borderColor : '';
      card.classList.toggle('is-active', active);
      if (link && animateChange && !reduceMotion) {
        animateElement(link, { borderColor: [fromColor, active ? '#dfb461' : 'rgba(214, 232, 241, 0.15)'] }, SPRING);
      }
    });
  };
  const clearTimer = () => {
    window.clearTimeout(timer);
    timer = 0;
  };
  const canAutoplay = () => !disposed && !reduceMotion && !isPaused && inView && document.visibilityState === 'visible' && !drag;
  const schedule = () => {
    clearTimer();
    if (canAutoplay()) timer = window.setTimeout(() => move(1), 3900);
  };
  const move = (direction, fromSwipe = false) => {
    if (disposed || drag) return;
    clearTimer();
    const target = wrapX(x - cardStep() * direction);
    if (direction) setActiveCard(activeIndex + direction);
    if (reduceMotion) {
      x = target;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      schedule();
      return;
    }
    currentAnimation?.stop();
    section.classList.add('is-sliding');
    currentAnimation = animateElement(track, { x: target }, fromSwipe ? { ...SPRING, velocity: 0 } : SPRING);
    currentAnimation.then(() => {
      if (disposed) return;
      x = wrapX(target);
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      currentAnimation = null;
      section.classList.remove('is-sliding');
      schedule();
    }).catch(() => {});
  };

  measure();
  x = -cycleWidth;
  track.style.transform = `translate3d(${x}px, 0, 0)`;
  setActiveCard(activeIndex, false);
  originals.forEach((card) => card.classList.add('motion-carousel-card'));
  section.dataset.motionCarouselReady = 'true';

  const headingItems = [...section.querySelectorAll('.system-heading > div > *, .system-heading > .system-all-link')];
  const reveal = () => {
    if (disposed || revealAnimation || reduceMotion) return;
    const entrance = { duration: 0.62, ease: [0.22, 1, 0.36, 1] };
    if (headingItems.length) {
      revealAnimation = animateElement(headingItems, { opacity: [0, 1], y: [10, 0] }, { ...entrance, delay: stagger(0.065) });
    }
    animateElement(originals, { opacity: [0, 1], y: [16, 0] }, { ...entrance, delay: stagger(0.085, { startDelay: 0.08 }) });
  };
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      if (inView) reveal();
      schedule();
    }, { threshold: 0.18 });
    revealObserver.observe(section);
  } else {
    inView = true;
    reveal();
  }

  const onPrevious = () => move(-1);
  const onNext = () => move(1);
  const onPause = () => {
    isPaused = !isPaused;
    section.classList.toggle('is-paused', isPaused);
    pause.setAttribute('aria-pressed', String(isPaused));
    pause.setAttribute('aria-label', isPaused ? 'Tiếp tục trình chiếu' : 'Tạm dừng chuyển động');
    pause.textContent = isPaused ? 'Tiếp tục' : 'Tạm dừng';
    schedule();
  };
  const onPointerDown = (event) => {
    if ((event.pointerType === 'mouse' && event.button !== 0) || originals.length < 2) return;
    clearTimer();
    currentAnimation?.stop();
    currentAnimation = null;
    x = readTranslateX(track);
    drag = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastTime: performance.now(), startPosition: x, velocity: 0, active: false };
  };
  const onPointerMove = (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.active && Math.abs(dy) > Math.abs(dx) + 5) {
      drag = null;
      schedule();
      return;
    }
    if (Math.abs(dx) < 4 && !drag.active) return;
    drag.active = true;
    const now = performance.now();
    drag.velocity = (event.clientX - drag.lastX) / Math.max(1, now - drag.lastTime);
    drag.lastX = event.clientX;
    drag.lastTime = now;
    event.preventDefault();
    x = drag.startPosition + dx;
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  };
  const onPointerUp = (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const ended = drag;
    drag = null;
    if (!ended.active) {
      schedule();
      return;
    }
    suppressClick = true;
    window.setTimeout(() => { suppressClick = false; }, 0);
    const step = cardStep();
    const momentum = Math.max(-step * 1.5, Math.min(step * 1.5, ended.velocity * 220));
    const projected = x + momentum;
    const currentStep = Math.round((-cycleWidth - x) / step);
    const projectedStep = Math.round((-cycleWidth - projected) / step);
    const steps = Math.max(-1, Math.min(1, projectedStep - currentStep));
    const target = wrapX(-cycleWidth - (currentStep + steps) * step);
    setActiveCard(activeIndex + steps);
    if (reduceMotion) {
      x = target;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      schedule();
      return;
    }
    section.classList.add('is-sliding');
    currentAnimation = animateElement(track, { x: target }, { ...SPRING, velocity: -ended.velocity * 1000 });
    currentAnimation.then(() => {
      if (disposed) return;
      x = wrapX(target);
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      currentAnimation = null;
      section.classList.remove('is-sliding');
      schedule();
    }).catch(() => {});
  };
  const onClickCapture = (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  const onResize = () => {
    currentAnimation?.stop();
    currentAnimation = null;
    measure();
    x = -cycleWidth;
    track.style.transform = `translate3d(${x}px, 0, 0)`;
    setActiveCard(window.matchMedia('(min-width: 701px)').matches ? 2 : 0, false);
  };
  const onVisibility = () => schedule();

  previous.addEventListener('click', onPrevious);
  next.addEventListener('click', onNext);
  pause.addEventListener('click', onPause);
  track.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  track.addEventListener('click', onClickCapture, true);
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);

  resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;
  resizeObserver?.observe(viewport);
  schedule();

  return {
    section,
    cleanup() {
      disposed = true;
      clearTimer();
      currentAnimation?.stop();
      revealAnimation?.stop();
      springAnimations.forEach((animation) => animation.stop());
      revealObserver?.disconnect();
      resizeObserver?.disconnect();
      previous.removeEventListener('click', onPrevious);
      next.removeEventListener('click', onNext);
      pause.removeEventListener('click', onPause);
      track.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      track.removeEventListener('click', onClickCapture, true);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      track.replaceChildren(...originals);
      track.style.removeProperty('transform');
      section.classList.remove('is-sliding', 'is-paused');
      delete section.dataset.motionCarouselReady;
      originals.forEach((card) => {
        card.classList.remove('is-active', 'motion-carousel-card');
        card.style.removeProperty('opacity');
        card.style.removeProperty('transform');
        card.querySelector(':scope > a')?.style.removeProperty('border-color');
      });
      headingItems.forEach((item) => {
        item.style.removeProperty('opacity');
        item.style.removeProperty('transform');
      });
      pause.setAttribute('aria-pressed', 'false');
      pause.setAttribute('aria-label', 'Tạm dừng chuyển động');
      pause.textContent = 'Tạm dừng';
    }
  };
}

export default function HomepageFeaturedProductsMotion() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = null;
    const mountWhenReady = () => {
      if (active && !active.section.isConnected) {
        active.cleanup();
        active = null;
      }
      const section = document.querySelector('#main.home-page > .system-section');
      if (section && !active) active = setupCarousel(section, Boolean(reduceMotion));
    };
    const observer = new MutationObserver(mountWhenReady);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    mountWhenReady();

    return () => {
      observer.disconnect();
      active?.cleanup();
    };
  }, [reduceMotion]);

  return null;
}
