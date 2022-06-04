export function drawDiceValues(array) {
  let row1 = '';
  let row2 = '';
  let row3 = '';
  let row4 = '';
  const len = array.length;
  for(var i = 0; i < len; i += 1) {
    row1 += ' ______  ';
    switch(array[i]) {
      case 1:
        row2 += '|      | ';
        row3 += '|   0  | ';
        row4 += '|______| ';
        break;
      case 2:
        row2 += '|    0 | ';
        row3 += '|      | ';
        row4 += '|_0____| ';
        break;
      case 3:
        row2 += '|    0 | ';
        row3 += '|   0  | ';
        row4 += '|_0____| ';
        break;
      case 4:
        row2 += '| 0  0 | ';
        row3 += '|      | ';
        row4 += '|_0__0_| ';
        break;
      case 5:
        row2 += '| 0  0 | ';
        row3 += '|   0  | ';
        row4 += '|_0__0_| ';
        break;
      case 6:
        row2 += '| 0  0 | ';
        row3 += '| 0  0 | ';
        row4 += '|_0__0_| ';
        break;
      default:
        row2 += '|      | ';
        row3 += '|      | ';
        row4 += '|______| ';
    }
  }
  console.log(row1 + '\n' + row2 + '\n' + row3 + '\n' + row4 + '\n');
}

export function rollDice(num) {
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

/*
 ______   ______   ______   ______   ______   ______
|      | |    0 | |    0 | | 0  0 | | 0  0 | | 0  0 |
|   0  | |      | |   0  | |      | |   0  | | 0  0 |
|______| |_0____| |_0____| |_0__0_| |_0__0_| |_0__0_|
*/
