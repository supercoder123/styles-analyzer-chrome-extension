import { useEffect, useState } from "react";
import { colord } from "colord";

import "./App.css";

export const Section = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <>
      <div className="p-3 m-3 rounded-md shadow-md bg-white">
        <h3 className="text-lg mb-3 font-bold text-lime-800">{title}</h3>
        <hr className="mb-3" />
        {children}
      </div>
    </>
  );
};

type ColorFormat = "rgba" | "hex" | "space";

export const getColor = (color: string, format: ColorFormat): string => {
  switch (format) {
    case "rgba":
      return colord(color).toRgbString();

    case "hex":
      return colord(color).toHex();

    case "space":
      const { r, g, b, a } = colord(color).toRgb();
      return `${r} ${g} ${b} ${a}`;

    default:
      return colord(color).toHex();
  }
};

interface ContentPayload {
  colors: string[];
  bgColors: string[];
  fontSizes: string[];
  boxShadows: string[];
  fontFamilies: string[];
  images: Array<{ type: "img" | "gradient" | "base64"; value: string }>;
}

function App() {
  const [colorFormat, setColorFormat] = useState<ColorFormat>("hex");

  const [stylesList, setStylesList] = useState<ContentPayload>({
    colors: [],
    bgColors: [],
    fontSizes: [],
    boxShadows: [],
    images: [],
    fontFamilies: [],
  });

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id!,
        "message",
        (response: ContentPayload) => {
          console.log(response);
          setStylesList(response);
        }
      );
    });
  }, []);

  return (
    <>
      <div className="p-3 flex justify-between text-xl font-bold sticky top-0 bg-slate-50 border-2 border-b-orange-600">
        <h1>Styles analyzer</h1>
        <div className="text-base font-normal">
          <label htmlFor="formatpicker">Color format: </label>
          <select
            name="formatpicker"
            className="border"
            value={colorFormat}
            onChange={(e) => {
              setColorFormat(e.target.value as ColorFormat);
            }}
          >
            <option value="rgba">rgba</option>
            <option value="hex">hex</option>
            <option value="space">space separated</option>
          </select>
        </div>
      </div>

      <Section title="Background Colors">
        <div className="flex flex-wrap gap-2">
          {stylesList?.bgColors.map((backgroundColor) => (
            // <div
            //   style={{ backgroundColor }}
            //   className="w-24 h-16 cursor-pointer rounded-md border border-slate-200 group text-base"
            //   onClick={(e) => {
            //     navigator.clipboard.writeText(
            //       (e.target as HTMLDivElement).innerText
            //     );
            //   }}
            // >
            //   <div className="bg-slate-800/30 rounded-md hidden group-hover:flex w-full h-full justify-center text-white items-center p-2 active:translate-y-1">
            //     {getColor(backgroundColor, colorFormat)}
            //   </div>
            // </div>

            <div className="flex items-center border border-slate-400 overflow-hidden hover:bg-black/10 rounded-md active:translate-y-1 cursor-pointer">
              <span
                style={{ backgroundColor }}
                className="w-10 h-full border-r border-slate-400"
              ></span>
              <div
                className="text-xl rounded-md mx-2 text-gray-600 p-1"
                onClick={(e) => {
                  navigator.clipboard.writeText(
                    (e.target as HTMLDivElement).innerText
                  );
                }}
              >
                {getColor(backgroundColor, colorFormat)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Font Sizes">
        <div className="flex flex-wrap gap-2">
          {stylesList?.fontSizes.map((fontSize) => (
            <div
              style={{ fontSize }}
              className="text-xl rounded-md m-2 active:translate-y-1 cursor-pointer"
              onClick={(e) => {
                navigator.clipboard.writeText(
                  (e.target as HTMLDivElement).innerText
                );
              }}
            >
              {fontSize}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Fonts">
        <ol className="list-decimal pl-6">
          {stylesList?.fontFamilies.map((fontFamily) => (
            <li
              className="text-xl active:translate-y-1 cursor-pointer"
              onClick={(e) => {
                navigator.clipboard.writeText(
                  (e.target as HTMLDivElement).innerText
                );
              }}
            >
              {fontFamily}
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Text colors">
        <div className="flex flex-wrap gap-2">
          {stylesList?.colors.map((color) => {
            return (
              <div className="flex items-center border border-slate-400 overflow-hidden hover:bg-black/10 rounded-md active:translate-y-1 cursor-pointer">
                <span
                  style={{ backgroundColor: color }}
                  className="w-10 h-full border-r border-slate-400"
                ></span>
                <div
                  className="text-xl rounded-md mx-2 text-gray-600 p-1"
                  onClick={(e) => {
                    navigator.clipboard.writeText(
                      (e.target as HTMLDivElement).innerText
                    );
                  }}
                >
                  {getColor(color, colorFormat)}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {stylesList?.boxShadows.length > 0 && (
        <Section title="Box Shadows">
          <div className="flex flex-wrap gap-2">
            {stylesList?.boxShadows.map((boxShadow) => (
              <div
                style={{ boxShadow }}
                className="text-lg rounded-md w-24 h-16 active:translate-y-1 cursor-pointer"
                title={boxShadow}
                onClick={() => {
                  navigator.clipboard.writeText(boxShadow);
                }}
              ></div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Images">
        <div className="flex flex-wrap gap-2">
          {stylesList?.images.map((image) => {
            if (image.type === "img") {
              return (
                <img
                  src={image.value}
                  className="text-lg rounded-md max-w-[100px] h-20 aspect-auto object-contain bg-no-repeat cursor-pointer hover:bg-black/30"
                  onClick={() => window.open(image.value)}
                />
              );
            }

            return (
              <div
                style={{ backgroundImage: image.value }}
                className="text-lg rounded-md max-w-full h-20 object-contain bg-no-repeat"
              ></div>
            );
          })}
        </div>
      </Section>
    </>
  );
}

export default App;
