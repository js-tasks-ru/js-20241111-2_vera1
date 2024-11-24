/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

  if (size === undefined) {
    return string;
  }

  if (size === 0) {
    return "";
  }

  let arr = string.split("");
  const allowedCountIdentical = size - 1;
  let countIdentical = 0;

  function deleteElement() {
    const indexToDelete = (i - countIdentical) + allowedCountIdentical + 1;
    arr.splice(indexToDelete, countIdentical - allowedCountIdentical);
    countIdentical = 0;
    i = 0;
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr.length - 1) { //Если последний элемент
      if (countIdentical > allowedCountIdentical) {
        deleteElement();
      }
    } else if (arr[i] === arr[i + 1]) {
      ++countIdentical;
    } else if (arr[i] !== arr[i + 1]) {
      if (countIdentical > allowedCountIdentical) {
        const indexToDelete = (i - countIdentical) + allowedCountIdentical + 1;
        arr.splice(indexToDelete, countIdentical - allowedCountIdentical);//Удалим все элементы что были до совпадения
        countIdentical = 0;
        i = 0;
      } else if (countIdentical <= allowedCountIdentical) {
        countIdentical = 0;
      }
    }
  }
  return arr.join("");
}
