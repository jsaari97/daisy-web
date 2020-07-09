/**
 * Walk the DOM Tree
 * @param {Element} element
 * @param {(element: Element) => void} handle
 * @param {boolean} visited
 */
export const readNode = (element, handle, visited) => {
  if (!element) {
    return;
  }

  if (!visited && element.attributes["smilref"]) {
    handle(element);
  }

  let next;

  if (!visited && element.firstElementChild) {
    next = element.firstElementChild;
  } else {
    next = element.nextElementSibling || element.parentElement || null;
  }

  readNode(next, handle, next === element.parentElement);
};
