export const flattenArr = (arr) => {
  return arr.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
};

export const obj2Arr = (obj) => {
  return Object.keys(obj).map(key => obj[key]);
};

export const getParentNode = (node, parentClassName) => {
  let current = node;
  while(current !== null) {
    if (current.classList.contains(parentClassName)) {
      return current;
    }
    current = current.parentNode;
  }

  return false;
};
