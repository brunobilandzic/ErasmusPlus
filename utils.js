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

export const getRandomNumberInRange = (range) => {
  const drafted = new Set();
  console.log("range", range);
  return function* () {
    while (drafted.size < range) {
      const random = Math.floor(Math.random() * range);
      if (!drafted.has(random)) {
        console.log(drafted, range, random);
        drafted.add(random);
        yield random;
      }
    }
  };
};

export const randomTruth = (probability = 0.5) => {
  return Math.random() < probability;
};

export const getRandomIndex = (length) => {
  return Math.floor(Math.random() * length);
};

export const roleModelName = (role) => {
  return `${capitalize(role)}Role`;
};
