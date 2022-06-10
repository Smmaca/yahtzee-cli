![Coverage statements](./badges/badge-statements.svg)
![Coverage branches](./badges/badge-branches.svg)
![Coverage functions](./badges/badge-functions.svg)
![Coverage lines](./badges/badge-lines.svg)



```
 __   __    _     _                _ 
 \ \ / /_ _| |__ | |_ _______  ___| |
  \ V / _` | '_ \| __|_  / _ \/ _ \ |
   | | (_| | | | | |_ / /  __/  __/_|
   |_|\__,_|_| |_|\__/___\___|\___(_)
```

A game of Yahtzee that runs in the command line. The object of the game is to score as high as possible by rolling five dice to get different combinations over 13 turns (see full rules linked at bottom of README).

## Instructions to run

Run `npm i` then `npm start`

## Run unit tests

Run `npm test`

## To Do

- [X] Joker rules should have a second fallback of scoring a 0 in any upper section box if all the lower section boxes are filled
- [X] Main menu
- [X] 2+ players
- [ ] Game stats
  - [ ] High score
  - [ ] Low score
  - [ ] Average score
  - [ ] Most yahtzees in a single game
  - [ ] Total games played
- [ ] User profile to save player's name and player's play history over sessions
- [ ] Print scoresheet to file
- [ ] Settings
  - [ ] Change dice style between pips and digits
- [ ] Achievements
  - [ ] Get the lowest possible score (5)
  - [ ] Get a yahtzee
  - [ ] Get two yahtzees in a single game
  - [ ] Get three yahtzees in a single game
  - [ ] Get the upper section bonus
  - [ ] Get four of each number in the upper section
  - [ ] Get a final score over 200
  - [ ] Get a final score over 300
  - [ ] Get a final score over 400
  - [ ] Play an entire game without rerolling
- [ ] 100% unit test coverage
- [ ] E2E tests using MockPrompter

## Related links

- [Hasbro rulebook](https://www.hasbro.com/common/instruct/yahtzee.pdf)
- [Printable scoresheet](https://www.memory-improvement-tips.com/support-files/yahtzee-score-sheets.pdf)
- [Yahtzee probability](https://www.datagenetics.com/blog/january42012/#:~:text=5%20dice,possible%20combinations%20for%20five%20dice.)
