import { readNode, convertToSeconds } from "./reader";

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

describe('Timestamp Conversion', () => {
  it('should convert to seconds', () => {
    expect(convertToSeconds('0:00:02')).toEqual(2);
    expect(convertToSeconds('0:00:13.055')).toEqual(13.055);
    expect(convertToSeconds('0:15:13.7')).toEqual(913.7);
    expect(convertToSeconds('1:15:16')).toEqual(4516);
  })
})
