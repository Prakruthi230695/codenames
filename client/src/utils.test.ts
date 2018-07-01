import { shuffle } from './utils';


const ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const itemsToShuffle = ITEMS.slice(0);

beforeEach (() => {
  ITEMS.sort();
  itemsToShuffle.sort();
})

it('changes the item order of the array', () => {
  shuffle(itemsToShuffle);
  expect(itemsToShuffle).not.toEqual(ITEMS);
});

it('does not change the members of the array', () => {
  shuffle(itemsToShuffle);
  itemsToShuffle.sort();
  expect(itemsToShuffle).toEqual(ITEMS);
});
