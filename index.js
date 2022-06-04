import clear from 'clear';
import { rollDice, drawDiceValues } from './helper';

var diceRoll = rollDice(5);

clear();
drawDiceValues(diceRoll);
