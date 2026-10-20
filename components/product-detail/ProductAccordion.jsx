'use client';

import { useState } from 'react';
import styles from './product-detail.module.css';

export default function ProductAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <div className={styles.faqList}>
      {items.map(([question, answer], index) => {
        const isOpen = openIndex === index;
        const panelId = `product-faq-answer-${index}`;

        return (
          <section className={styles.faqItem} key={question}>
            <h3 className={styles.faqQuestion}>
              <button
                className={styles.faqToggle}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((current) => current === index ? -1 : index)}
              >
                {question}
                <span className={styles.faqIcon} aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </h3>
            <div
              className={`${styles.faqPanel} ${isOpen ? styles.faqPanelOpen : ''}`}
              id={panelId}
              aria-hidden={!isOpen}
            >
              <div className={styles.faqPanelInner}><p>{answer}</p></div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
