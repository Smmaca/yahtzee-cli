
export function rollDice(num): number[] {
  const values = [];
  for(var i = 0; i < num; i += 1) {
    values.push(getRandomIntInclusive(1,6));
  }
  return values;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}