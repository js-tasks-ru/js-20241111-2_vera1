/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  let funFind = (obj) => {
    let arr = path.split(".");
    for (let value of arr) {
      if (value in obj && value !== "toString") {
        obj = obj[value];
      } else {
        return;
      }
    }
    return obj;
  };
  return funFind;
}
