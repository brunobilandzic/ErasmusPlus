export const capitalize = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

export function stringifyProperties(obj) {
  return Object.keys(obj)
    .map((key) => `${key}: ${JSON.stringify(obj[key])}`)
    .join("\n");
}

export const getModelFromIndex = (indexString) => {
  if (!indexString || !indexString.includes("Index")) return null;
  const modelName = indexString.split("Index")[0];
  return modelName;
};
