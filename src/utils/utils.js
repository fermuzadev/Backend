import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const getRandomId = (array) => {
  let numId = parseInt(Math.random() * (10000 - 1) + 1);
  if (numId === array.id) {
    numId = parseInt(Math.random() * (10000 - 1) + 1);
  } else {
    return numId;
  }
};
