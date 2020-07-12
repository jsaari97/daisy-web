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
    const item1 = createElement("li", { smilref: "test#tcs" });
    const child1 = createElement("p", { smilref: "test" });
    const strong = createElement("strong");
    const child2 = createElement("span", { smilref: "test" });
    const item2 = createElement("li");
    const item3 = createElement("li", { smilref: "test#tcs" });
    const span = createElement("span", { smilref: "test" });
    const item4 = createElement("li", { smilref: "test#tcs" });
    const item4child = createElement("p");
    const item4span1 = createElement("span", { smilref: "test" });
    const item4span2 = createElement("span", { smilref: "test" });
    const item5 = createElement("figure");
    const item5child = createElement("img", { smilref: "test" });

    child1.append(strong);
    item1.append(child1, child2);
    item3.append(span);
    item4.append(item4child);
    item4child.append(item4span1, item4span2);
    item5.append(item5child);
    list.append(item1, item2, item3, item4, item5);

    expect(lookBackward(child2)).toBe(child1);
    expect(lookBackward(item1)).toBe(null);
    expect(lookBackward(span)).toBe(child2);
    expect(lookBackward(item4child)).toBe(span);
    expect(lookBackward(item5child)).toBe(item4span2);
  });
});
