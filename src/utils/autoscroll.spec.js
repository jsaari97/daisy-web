const { autoscroll, OFFSET } = require("./autoscroll");

/**
 * @param {{offset: number, height: number}} config
 * @returns {HTMLDivElement}
 */
function mockElement({ height, offset }) {
  return {
    getBoundingClientRect: () => ({
      height,
      y: offset,
    }),
  };
}

/**
 *
 * @param {{offset: number, height: number}} config
 * @returns {function}
 */
function mockDOM({ offset, height }) {
  const scrollTo = jest.fn();

  Object.defineProperty(global, "window", {
    value: {
      pageYOffset: offset,
      innerHeight: height,
      scrollTo,
    },
    writable: true,
  });

  return scrollTo;
}

describe("Auto Scroll", () => {
  it("should not scroll if not intersecting", () => {
    const callback = mockDOM({ height: 500, offset: 25 });
    const element = mockElement({ height: 100, offset: 100 });

    autoscroll(element);

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it("should scroll down", () => {
    const callback = mockDOM({ height: 500, offset: 25 });
    const element = mockElement({ height: 200, offset: 400 });

    autoscroll(element);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith({ top: 425 - OFFSET * 2, behavior: "smooth" });
  });

  it("should scroll up", () => {
    const callback = mockDOM({ height: 500, offset: 1000 });
    const element = mockElement({ height: 200, offset: -100 });

    autoscroll(element);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith({ top: 600 + OFFSET * 4, behavior: "smooth" });
  });
});
