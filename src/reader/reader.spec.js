import { readContentDOM } from "./reader";

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
