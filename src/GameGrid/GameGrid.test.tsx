import * as React from 'react';

import { createShallow, createMount } from '@material-ui/core/test-utils';

import WordTile from '../WordTile/WordTile';
import GameGrid from './GameGrid';


interface Props {
  playerType: "player" | "spymaster",
  handleGuess(e: any): void
}

const setup = (propOverrides?: Partial<Props>) => {
  const props: Props = Object.assign({
    playerType: "player",
    handleGuess: jest.fn()
  }, propOverrides);

  // Need to do this so that I can get at the state of the component wrapped
  // in the withStyles(styles) HOC.
  const shallow = createShallow();
  const shallowWrapper = shallow(<GameGrid {...props} />)
  const mount = createMount();
  const wrapper = mount(shallowWrapper.getElement());
  return wrapper;
};

it('renders without crashing', () => {
  setup();
});

it('produces 25 grouped words', () => {
  const wrapper = setup();
  expect(wrapper.state().groupedWords.length).toBe(25);
});

it('produces the right number of words per group', () => {
  const wrapper = setup();
  const groupedWords = wrapper.state().groupedWords;
  const groupCounts = {
    "red": 0,
    "blue": 0,
    "neutral": 0,
    "death": 0
  }
  const expectedGroupCounts = {
    "red": 9,
    "blue": 8,
    "neutral": 7,
    "death": 1
  }
  for (const groupedWord of groupedWords) {
    groupCounts[groupedWord.group] += 1;
  }
  expect(expectedGroupCounts).toEqual(groupCounts);
});

it('passes props to WordTiles', () => {
  const wrapper = setup();
  const wordTile = wrapper.find(WordTile).first();
  expect(wordTile.props().playerType).toBe(wrapper.props().playerType);
  expect(wordTile.props().handleGuess).toBe(wrapper.props().handleGuess);
  expect(wordTile.props().groupedWord).toBe(wrapper.state().groupedWords[0]);
});
