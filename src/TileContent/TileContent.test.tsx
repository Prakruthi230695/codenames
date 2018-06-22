import * as React from 'react';

import { createShallow } from '@material-ui/core/test-utils';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import TileContent from './TileContent';

interface Props {
  groupedWord: {
    word: string,
    group: "red" | "blue" | "neutral" | "death"
  },
  playerType: "player" | "spymaster",
  handleGuess: jest.Mock
}

const setup = (propOverrides?: Partial<Props>) => {
  const props: Props = Object.assign({
    groupedWord: {
      group: "red",
      word: "EUROPE"
    },
    playerType: "player",
    handleGuess: jest.fn()
  }, propOverrides);

  const shallow = createShallow({untilSelector: 'TileContent'});
  const wrapper = shallow(<TileContent {...props} />);
  return wrapper;
};

it('renders without crashing', () => {
  setup();
});

it('displays the word', () => {
  const wrapper = setup();
  expect(wrapper.find(Typography).childAt(0).text()).toBe("EUROPE");
});

it('is marked as guessed on click', () => {
  const wrapper = setup();
  const tile = wrapper.find(Paper);
  tile.simulate('click');
  expect(wrapper.state().guessed).toBeTruthy();
  tile.simulate('click');
  expect(wrapper.state().guessed).toBeTruthy();
});

it('calls handleGuess on click', () => {
  const spy = jest.fn();
  const wrapper = setup({handleGuess: spy});
  const tile = wrapper.find(Paper);
  tile.simulate('click');
  expect(spy).toHaveBeenCalled();
});
