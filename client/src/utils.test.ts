import { shuffle, isRootUrlPath } from './utils';


/* shuffle tests */
const ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const itemsToShuffle = ITEMS.slice(0);

it('changes the item order of the array', () => {
  ITEMS.sort();
  itemsToShuffle.sort();
  shuffle(itemsToShuffle);
  expect(itemsToShuffle).not.toEqual(ITEMS);
});

it('does not change the members of the array', () => {
  ITEMS.sort();
  itemsToShuffle.sort();
  shuffle(itemsToShuffle);
  itemsToShuffle.sort();
  expect(itemsToShuffle).toEqual(ITEMS);
});


/* isRootUrlPath tests
 * I cannot figure out how to change the pathname without throwing an error.
 * I'm just settling for testing the truth return value, since it at least
 * shows that I didn't get the truthiness flipped.
 */
it('root urls return true', () => {
  expect(isRootUrlPath()).toBeTruthy();
});
