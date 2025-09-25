import { magics } from "./magicCards";

export const randomMagic = () => {
  return magics[Math.floor(Math.random() * magics.length)];
};
