import { parseXml, parseNode } from "./dom";

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
});

describe("Manipulate XML Dom", () => {
  it("should embed images", () => {
    const root = document.createElement("div");
    const group = document.createElement("imggroup");
    const img = document.createElement("img");
    img.src = "image.png";
    img.setAttribute("smilref", "test");

    root.appendChild(group);
    group.appendChild(img);

    const result = parseNode(root);

    expect(result.children[0].tagName).toEqual("FIGURE");
  });
});
