const DEFAULT_PAGE_SELECTOR = "*:not(script, noscript, link, meta, head, html)";

export class ContentPage {
  private allElements = [];

  constructor(selector = DEFAULT_PAGE_SELECTOR) {
    this.allElements = Array.from(document.querySelectorAll(selector));
  }

  getComputedStyleList(property: string) {
    const list: string[] = [];
    const set = new Set();

    this.allElements.forEach((element) => {
      const elementStyles = getComputedStyle(element);
      const value = elementStyles.getPropertyValue(property);
      if (set.has(value)) return;
      set.add(value);
      list.push(value);
    });
    set.clear();
    return list;
  }
}
