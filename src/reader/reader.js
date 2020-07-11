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

/**
 *
 * @param {Element} element
 * @param {Boolean} visited
 */
export function lookBackward(element, visited = true) {
  if (!element) {
    return null;
  }

  if (!visited && element.attributes["smilref"]) {
    return element;
  }

  let next;

  if (!visited && element.lastElementChild) {
    next = element.lastElementChild;
  } else {
    next = element.previousElementSibling || element.parentElement;
  }

  return lookBackward(next, next === element.parentElement);
}

/**
 *
 * @param {Element} element
 * @param {Boolean} visited
 */
export function lookForward(element, visited = element.attributes["smilref"]) {
  if (!element) {
    return null;
  }

  if (!visited && element.attributes["smilref"]) {
    return element;
  }

  let next;

  if (!visited && element.firstElementChild) {
    next = element.firstElementChild;
  } else {
    next = element.nextElementSibling || element.parentElement;
  }

  return lookForward(next, next === element.parentElement);
}
