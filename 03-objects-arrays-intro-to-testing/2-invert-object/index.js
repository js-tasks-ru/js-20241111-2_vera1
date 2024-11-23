/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  let map = new Map();

  if (!obj) {
    return;
  }

  for (let [key, value] of Object.entries(obj)) {
    map.set(value, key);
  }
  return Object.fromEntries(map.entries());
}
