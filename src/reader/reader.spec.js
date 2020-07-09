import { readNode } from "./reader";

describe("DOM Walker", () => {
  it("should traverse the tree", () => {
    const root = document.createElement('div')
    const list = document.createElement('ul')
    const item = document.createElement('li')

    root.appendChild(list)
    list.appendChild(item)

    item.setAttribute('smilref', 'test');

    const handle = jest.fn()

    readNode(root, handle)

    expect(handle).toHaveBeenCalledTimes(1)
  });

  it("should call handle", async () => {
    const root = document.createElement('div')
    const list = document.createElement('ul')
    const item = document.createElement('li')

    root.appendChild(list)
    list.appendChild(item)

    list.setAttribute('smilref', 'test');

    const handle = jest.fn()

    await readNode(item, handle)

    expect(handle).toHaveBeenCalledTimes(0)
  });
});
