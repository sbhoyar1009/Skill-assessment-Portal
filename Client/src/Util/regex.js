export function cleanTitle(title) {
  var result = title.replace(/[.\\/',:*?"<>|+@#!$%^&()_]/g, function (ch) {
    return "\\" + ch;
  });
  return result.replace(/((\s*\S+)*)\s*/, "$1");
}

export const checkSpecialChars = value => {
  let startswithNumber = value.match(/^([0-9])/g);
  var result = value.match(/[.\\/',:*?"<>|+@#!$%^&()_]/g);
  if (startswithNumber === null && result === null) {
    return true;
  } else {
    return false;
  }
};
