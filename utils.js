export const toUpperCase = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

export function stringifyProperties(obj) {
  return Object.keys(obj)
    .map((key) => `${key}: ${JSON.stringify(obj[key])}`)
    .join("\n");
}
