import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const scriptPath = path.join(process.cwd(), 'public', 'site-script.js');
let getMarkup;

function createMarkupRenderer() {
  const source = fs.readFileSync(scriptPath, 'utf8');
  const withoutBrowserBootstrap = source.replace(/^\s*installImageFallbacks\(\);\s*$/m, '');
  const start = withoutBrowserBootstrap.indexOf('function navigate(url){');
  const endMarker = 'window.__EUROWINDOW_RENDER__=render;window.__EUROWINDOW_LEGACY_SCRIPT_READY__=true;';
  const end = withoutBrowserBootstrap.indexOf(endMarker, start);

  if (start < 0 || end < 0 || withoutBrowserBootstrap === source) {
    throw new Error('Unable to prepare the existing page templates for server rendering');
  }

  const capture = `
    function __eurowindowServerMarkup(route){
      const page=(route||'/').replace(/\\/$/,'')||'/';
      if(page==='/')return home();
      if(page==='/gioi-thieu')return about();
      if(page==='/catalogue')return cataloguePage();
      if(page==='/san-pham')return officialProductListingPage();
      if(page.startsWith('/san-pham/'))return productDetail(page.split('/')[2]);
      if(page==='/he-nhom')return systemsPage();
      if(page.startsWith('/he-nhom/'))return systemDetail(page.split('/')[2]);
      if(page==='/du-an')return projectsPage();
      if(page.startsWith('/du-an/'))return projectDetail(page.split('/')[2]);
      if(page==='/tin-tuc')return newsPage();
      if(page.startsWith('/tin-tuc/'))return postDetail(page.split('/')[2]);
      if(page==='/lien-he')return contact();
      if(page==='/bao-gia')return quotePage();
      return notFound();
    }
    if(window.__EUROWINDOW_SSR_CAPTURE__){
      window.__EUROWINDOW_GET_MARKUP__=__eurowindowServerMarkup;
    }else{
  `;

  const executable = withoutBrowserBootstrap.slice(0, start)
    + capture
    + withoutBrowserBootstrap.slice(start, end)
    + '\n}\n'
    + withoutBrowserBootstrap.slice(end);
  const window = {
    __EUROWINDOW_SSR_CAPTURE__: true,
    matchMedia: () => ({ matches: false })
  };
  const document = { documentElement: { dataset: {} }, querySelector: () => null };

  vm.runInNewContext(executable, {
    window,
    document,
    location: { search: '' },
    URL,
    URLSearchParams,
    AbortController,
    console,
    setTimeout,
    clearTimeout,
    Intl,
    Date,
    Math,
    JSON,
    Map,
    Set,
    Promise
  }, { timeout: 5000, filename: 'eurowindow-page-templates.js' });

  if (typeof window.__EUROWINDOW_GET_MARKUP__ !== 'function') {
    throw new Error('Existing page templates did not expose a server renderer');
  }
  return window.__EUROWINDOW_GET_MARKUP__;
}

export function renderLegacyPage(routePath) {
  getMarkup ||= createMarkupRenderer();
  const markup = getMarkup(routePath);
  if (typeof markup !== 'string' || !markup.trim()) {
    throw new Error(`Existing page template returned no server content for ${routePath}`);
  }

  const rootMain = markup.match(/^\s*<main\b([^>]*)>([\s\S]*)<\/main>\s*$/i);
  if (!rootMain) return { markup, mainClassName: routePath === '/' ? 'home-page' : undefined };

  const className = rootMain[1].match(/\bclass=["']([^"']*)["']/i)?.[1];
  return { markup: rootMain[2], mainClassName: className || undefined };
}
