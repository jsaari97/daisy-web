import { readContentDOM } from "./reader";

describe("DOM Walker", () => {
  it("should traverse the tree", () => {
    const root = document.createElement("div");
    const list = document.createElement("ul");
    const item = document.createElement("li");

    root.appendChild(list);
    list.appendChild(item);

    item.setAttribute("smilref", "test");

    const walker = readContentDOM(root)

    expect(walker.next().value).toBe(item);
  });

  it("should traverse upwards", async () => {
    const root = document.createElement("div");
    const list = document.createElement("ul");
    const item = document.createElement("li");

    root.appendChild(list);
    list.appendChild(item);

    item.setAttribute("smilref", "test");
    list.setAttribute("smilref", "test");

    const walker = readContentDOM(list)

    expect(walker.next().value).toBe(list);
    expect(walker.next().value).toBe(item);
  });

  it("should traverse siblings", async () => {
    const list = document.createElement("ul");
    const item1 = document.createElement("li");
    const item2 = document.createElement("li");
    const item3 = document.createElement("li");

    list.appendChild(item1);
    list.appendChild(item2);
    list.appendChild(item3);

    item1.setAttribute("smilref", "test");
    item2.setAttribute("smilref", "test");
    item3.setAttribute("smilref", "test");

    const walker = readContentDOM(item1)

    expect(walker.next().value).toBe(item1);
    expect(walker.next().value).toBe(item2);
    expect(walker.next().value).toBe(item3);
  });
});
