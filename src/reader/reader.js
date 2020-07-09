/**
 * Walk the DOM Tree
 * @param {Element} element
 * @param {(element: Element) => Promise<void>} handle
 * @param {boolean} visited
 */
export const readNode = async (element, handle, visited) => {
  try {
    if (!element) {
      return;
    }

    if (!visited && element.attributes["smilref"]) {
      await handle(element);
    }

    let next;

    if (!visited && element.firstElementChild) {
      next = element.firstElementChild;
    } else {
      next = element.nextElementSibling || element.parentElement || null;
    }

    await readNode(next, handle, next === element.parentElement);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const handleNode = (zip) => async (element) => {
  try {
    console.log(element)
  } catch (error) {
    return Promise.reject(error);
  }
};
