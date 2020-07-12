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
export function lookBackward(element, previous = element) {
  if (!element) {
    return null;
  }

  const initial = element === previous;
  const upwards = element.firstElementChild === previous;
  const hasSibling = !!element.previousElementSibling;
  const hasChild = !!element.lastElementChild;

  if (
    !initial &&
    element.attributes["smilref"] &&
    !element.getAttribute("smilref").includes("#tcs") &&
    (upwards || !hasChild)
  ) {
    return element;
  }

  let next = element.parentElement;

  if ((initial || upwards || hasSibling) && element.previousElementSibling) {
    next = element.previousElementSibling;
  }

  if (!upwards && hasChild && !initial) {
    next = element.lastElementChild;
  }

  return lookBackward(next, element);
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
