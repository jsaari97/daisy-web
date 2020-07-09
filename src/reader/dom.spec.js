import { parseXml, embedImages, transformList } from "./dom";

describe("Parse XML to DOM compatible format", () => {
  it("should toggle xml namespace", () => {
    expect(
      parseXml(
        '<dtbook xmlns="http://www.daisy.org/z3986/2005/dtbook/"></dtbook>'
      )
    ).toEqual(
      '<dtbook xmlns:conf="http://www.daisy.org/z3986/2005/dtbook/"></dtbook>'
    );
  });

  it("should parse sentences", () => {
    const input = '<p><sent smilref="test#test">test</sent></p>';
    const output = '<p><span smilref="test#test">test</span></p>';

    expect(parseXml(input)).toEqual(output);

    expect(parseXml(input + input)).toEqual(output + output);
  });

  it("should parse levels", () => {
    const input = "<level1><level4>test</level4></level1>";
    const output =
      '<div class="level level-1"><div class="level level-4">test</div></div>';

    expect(parseXml(input)).toEqual(output);

    expect(parseXml(input + input)).toEqual(output + output);
  });

  it("should parse imggroup", () => {
    expect(parseXml('<imggroup><img src="x"></imggroup>')).toEqual(
      '<figure><img src="x"></figure>'
    );
  });
});

describe("Embed Document Images", () => {
  it("should embed images", async () => {
    const img = document.createElement("img");
    img.setAttribute("src", "image.png");
    img.setAttribute("smilref", "test");

    const zip = {
      file: (name) => {
        if (typeof name === "object") {
          return [{ name: "folder/image.png" }];
        }

        return {
          async: () =>
            new Promise((resolve) =>
              resolve(Buffer.from("test").toString("base64"))
            ),
        };
      },
    };

    await embedImages(zip)(img);

    expect(img.getAttribute("src")).toEqual(
      `data:image/png;base64,${Buffer.from("test").toString("base64")}`
    );
  });
});

describe("Transform Lists", () => {
  it("should handle unordered lists", () => {
    const root = document.createElement("div");
    const list = document.createElement("list");
    const item = document.createElement("li");

    root.appendChild(list);
    list.appendChild(item);

    list.setAttribute("type", "ul");

    transformList(list);

    expect(root.children[0].tagName).toEqual("UL");
  });

  it("should handle ordered lists", () => {
    const root = document.createElement("div");
    const list = document.createElement("list");
    const item = document.createElement("li");

    root.appendChild(list);
    list.appendChild(item);

    list.setAttribute("type", "ol");
    list.setAttribute("enum", "a");

    transformList(list);

    expect(root.children[0].tagName).toEqual("OL");
    expect(root.children[0].getAttribute("type")).toEqual("a");
  });
});
