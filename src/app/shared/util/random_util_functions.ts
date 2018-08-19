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

export const getRandomArraySubset = (array: any[]): any[] => {
  const numItems = getRandomInt(0, array.length);
  const shuffledArray: any[] = shuffleArray(array);
  const arraySubset: any[] = shuffledArray.slice(0, numItems);
  return arraySubset;
};

export const shuffleArray = (array: any[]): any[] => {
  const result: any[] = array.slice(0);

  let currentIndex: number = result.length;
  let temporaryValue: any;
  let randomIndex: number;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = result[currentIndex];
    result[currentIndex] = result[randomIndex];
    result[randomIndex] = temporaryValue;
  }

  return result;
};
