/**
 * Walk the DOM Tree
 * @param {Element} from
 * @returns {Generator<any, Element>}
 */
export function* readContentDOM(from) {
  let element = from;
  let visited = false;

  function walk(target) {
    let next;

    if (!visited && target.firstElementChild) {
      next = target.firstElementChild;
    } else {
      next = target.nextElementSibling || target.parentElement;
    }

    visited = next === target.parentElement;

    return next;
  }

  while (element) {
    if (!visited && element.attributes["smilref"]) {
      yield element;
    }

    element = walk(element);
  }
}
