/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  if (param === "asc") {
    return arr.slice().sort((a, b)=>a.localeCompare(b, ['ru', 'en'], {caseFirst: "upper"}));
  } else {
    let sorted = arr.slice().sort((a, b)=>a.localeCompare(b, ['ru', 'en'], {caseFirst: "lower"}));
    return sorted.reverse();
  }
}
