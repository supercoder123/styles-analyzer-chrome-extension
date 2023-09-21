// import { ContentPage } from "../src/utils/ContentPage";

const blackListColors = ["rgba(0, 0, 0, 0)"];
const blackListImage = ["none"];
const blackListValues = [...blackListColors, ...blackListImage, ""];

const DEFAULT_PAGE_SELECTOR =
  "body *:not(script, noscript, link, meta, head, html, picture, br, hr, iframe)";

class ContentPage {
  allElements = [];

  constructor(selector = DEFAULT_PAGE_SELECTOR) {
    this.allElements = Array.from(document.querySelectorAll(selector));
  }

  getComputedStyleList(property) {
    const set = new Set();

    const list = this.allElements
      .map((element) => {
        const elementStyles = getComputedStyle(element);
        const value = elementStyles.getPropertyValue(property);
        if (blackListValues.includes(value)) return null;
        if (set.has(value)) return null;
        set.add(value);
        return value;
      })
      .filter((item) => Boolean(item));

    set.clear();
    return list;
  }

  getAllImages() {
    const set = new Set();

    const list = Array.from(
      document.querySelectorAll("body img, body figure, body picture")
    )
      .map((element) => {
        const value = element.src;
        if (blackListValues.includes(value)) return null;
        if (set.has(value)) return null;
        set.add(value);
        return { value, type: "img" };
      })
      .filter((item) => Boolean(item));

    set.clear();

    const gradients = this.getComputedStyleList("background-image").map(
      (img) => {
        const urlMatch = img.match(/url/gi);
        const gradientMatch = img.match(/gradient/gi);

        if (urlMatch && urlMatch.length > 0) {
          const dataMatch = img.match(/data:/gi);

          if (dataMatch && dataMatch.length > 0) {
            return { type: "base64", value: img };
          }

          return {
            type: "img",
            value: img
              .replace("url(", "")
              .replace(")", "")
              .replace(/["']/g, ""),
          };
        } else if (gradientMatch && gradientMatch.length > 0) {
          return { type: "gradient", value: img };
        }
        return img;
      }
    );

    return [...list, ...gradients];
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const webpage = new ContentPage();

  sendResponse({
    colors: webpage.getComputedStyleList("color"),
    bgColors: webpage.getComputedStyleList("background-color"),
    fontSizes: webpage.getComputedStyleList("font-size"),
    lineHeights: webpage.getComputedStyleList("line-height"),
    boxShadows: webpage.getComputedStyleList("box-shadow"),
    fontFamilies: webpage.getComputedStyleList("font-family"),
    images: webpage.getAllImages(),
  });

  return true;
});
