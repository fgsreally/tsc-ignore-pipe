export const partition = (arr, predicate) => {
  const matchingItems = [];
  const nonMatchingItems = [];

  arr.forEach((item) => {
    const arrayToAppend = predicate(item) ? matchingItems : nonMatchingItems;

    arrayToAppend.push(item);
  });

  return [matchingItems, nonMatchingItems];
};

export function debug(info) {
  if (process.env.CI) {
    console.log(info);
  }
}
