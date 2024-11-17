/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  let newObj = Object.fromEntries(
    Object.entries(obj).filter(([a]) => {
      if (fields.includes(a)) {
        return false;
      } else {
        return true;
      }
    })
  );
  return newObj;
};
