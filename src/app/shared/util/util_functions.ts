export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const stringGen = (): string => {
  const len: number = getRandomInt(3, 8);
  let text: string = '';

  const charset: string = 'abcdefghijklmnopqrstuvwxyz';

  for (let i: number = 0; i < len; i++) {
    let randomChar: string = charset.charAt(Math.floor(Math.random() * charset.length));
    if (i === 0) {
      randomChar = randomChar.toUpperCase();
    }
    text += randomChar;
  }

  return text;
};
