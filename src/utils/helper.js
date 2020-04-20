export const flattenArr = (arr) => {
  return arr.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
};

export const obj2Arr = (obj) => {
  return Object.keys(obj).map(key => obj[key]);
};
