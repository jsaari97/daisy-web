export const OFFSET = 32;

/**
 * Scroll up or down if outside viewport
 * @param {Element} element
 * @returns {void}
 */
export function autoscroll(element) {
  const { height, y } = element.getBoundingClientRect();

  if (height + y > window.innerHeight - OFFSET * 3) {
    window.scrollTo({
      top: window.pageYOffset + y - OFFSET * 2,
      behavior: "smooth",
    });
  } else if (y < OFFSET) {
    const i = height + y;
    const h = window.innerHeight - i;

    window.scrollTo({
      top: Math.max(0, window.pageYOffset - h + OFFSET * 4),
      behavior: "smooth",
    });
  }
}
