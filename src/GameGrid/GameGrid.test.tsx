import * as React from 'react';

import { createShallow, createMount } from '@material-ui/core/test-utils';

import TileContent from '../TileContent/TileContent';
import GameGrid from './GameGrid';

import { GroupedWord } from '../Game/Game';


interface Props {
  playerType: "player" | "spymaster",
  groupedWords: GroupedWord[],
  handleGuess(e: any): void
}

const setup = (propOverrides?: Partial<Props>) => {
  const props: Props = Object.assign({
    playerType: "player",
    groupedWords: [
      {
        word: "what",
        group: "neutral",
        guessed: false
      },
    ],
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

it('passes props to TileContents', () => {
  const wrapper = setup();
  const wordTile = wrapper.find(TileContent).first();
  expect(wordTile.props().playerType).toBe(wrapper.props().playerType);
  expect(wordTile.props().handleGuess).toBe(wrapper.props().handleGuess);
  expect(wordTile.props().groupedWord).toBe(wrapper.props().groupedWords[0]);
});
