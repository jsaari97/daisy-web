import { readContentDOM, lookForward, lookBackward } from "./reader";

describe("DOM Walker", () => {
  it("should traverse the tree", () => {
    const root = createElement("div");
    const list = createElement("ul");
    const item = createElement("li", { smilref: "test" });

    root.appendChild(list);
    list.appendChild(item);

    const walker = readContentDOM(root);

    expect(walker.next().value).toBe(item);
  });

  it("should traverse upwards", async () => {
    const root = createElement("div");
    const list = createElement("ul", { smilref: "test" });
    const item = createElement("li", { smilref: "test" });

    root.appendChild(list);
    list.appendChild(item);

    const walker = readContentDOM(list);

    expect(walker.next().value).toBe(list);
    expect(walker.next().value).toBe(item);
  });

  it("should traverse siblings", async () => {
    const list = createElement("ul");
    const item1 = createElement("li", { smilref: "test" });
    const item2 = createElement("li", { smilref: "test" });
    const item3 = createElement("li", { smilref: "test" });

    list.append(item1, item2, item3);

    const walker = readContentDOM(item1);

    expect(walker.next().value).toBe(item1);
    expect(walker.next().value).toBe(item2);
    expect(walker.next().value).toBe(item3);
  });
});

describe("Find next DOM element", () => {
  it("should find next", () => {
    const list = createElement("ul");
    const item1 = createElement("li", { smilref: "test" });
    const item2 = createElement("li");
    const item3 = createElement("li", { smilref: "test" });

    list.append(item1, item2, item3);

    expect(lookForward(item1)).toBe(item3);
    expect(lookForward(item3)).toBe(null);
    expect(lookForward(list)).toBe(item1);
  });
});

describe("Find previous DOM element", () => {
  it("should find previous", () => {
    const list = createElement("ul");
    const item1 = createElement("li", { smilref: "test" });
    const item2 = createElement("li");
    const item3 = createElement("li", { smilref: "test" });
    const span = createElement("span", { smilref: "test" });

    item3.appendChild(span);
    list.append(item1, item2, item3);

    expect(lookBackward(span)).toBe(item1);
    expect(lookBackward(item1)).toBe(null);
  });
});
