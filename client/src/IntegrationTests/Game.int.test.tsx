import * as React from 'react';

import { createShallow, createMount } from '@material-ui/core/test-utils';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import RadioGroup from '@material-ui/core/RadioGroup';

import TurnIndicator from '../TurnIndicator/TurnIndicator';
import TileContent from '../TileContent/TileContent';
import PlayerToggle from '../PlayerToggle/PlayerToggle';
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay';
import GameGrid from '../GameGrid/GameGrid';
import EndTurnButton from '../EndTurnButton/EndTurnButton';
import NewGameWidget from '../NewGameWidget/NewGameWidget';

import Game, { GroupedWord } from '../Game/Game';

const DEFAULT_STATE = {
  playerType: "player",
  turn: "red",
  winner: "",
  remaining: {
    red: 9,
    blue: 8
  },
  groupedWords: [],  // as GroupedWord[],
  playerToggleKey: 0
}

const setup = () => {
  // Need to do this so that I can get at the state of the component wrapped
  // in the withStyles(styles) HOC.
  const shallow = createShallow();
  const shallowWrapper = shallow(<Game  />);
  const mount = createMount();
  const wrapper = mount(shallowWrapper.getElement());
  return wrapper;
};

it('renders without crashing', () => {
  setup();
});

it('toggles turns on End Turn btn click', () => {
  const wrapper = setup();
  expect(wrapper.state().turn).toBe("red");
  const etb = wrapper.find(EndTurnButton);
  etb.simulate('click');
  expect(wrapper.state().turn).toBe("blue");
  etb.simulate('click');
  expect(wrapper.state().turn).toBe("red");
});

it('displays whose turn it is', () => {
  const wrapper = setup();
  const ti = wrapper.find(TurnIndicator);
  expect(ti.text().toLowerCase()).toMatch(/red.+turn/);
  const etb = wrapper.find(EndTurnButton);
  etb.simulate('click');
  expect(ti.text().toLowerCase()).toMatch(/blue.+turn/);
  etb.simulate('click');
  expect(ti.text().toLowerCase()).toMatch(/red.+turn/);
});

it('changes player types with Player Type widget', () => {
  const wrapper = setup();
  // simulate wasn't behaving properly, so I'm just directly calling the method
  // that was supposed to be called by onChange.
  const pt = wrapper.find(PlayerToggle).childAt(0).instance() as any;
  pt.handleChange( {currentTarget: {value: 'spymaster'}} );
  expect(wrapper.state().playerType).toBe("spymaster");
  pt.handleChange( {currentTarget: {value: 'player'}} );
  expect(wrapper.state().playerType).toBe("player");
});

it('calls handleNewGame on New Game btn click (state: winner="red")', () => {
  const wrapper = setup();
  const spy = jest.spyOn(wrapper.instance() as any, 'handleNewGame');
  wrapper.setState({winner: "red"});
  const ngb = wrapper.find(NewGameWidget).children(Button);
  ngb.simulate('click');
  expect(spy).toHaveBeenCalled();
});

//// This test does not work because I cannot figure out how to assign
//// a spy to the Game's prototype (`Game` is actually the HOC, so it just
//// has `withStyles`), and spying on the instance's method was not working
//// (the actual method is being called, not the spied mock).
// it('calls handleGuess on tile click', () => {
//   const wrapper = setup();
//   let inst = wrapper.instance() as any;
//   inst.createNewGame();
//   wrapper.update();
//   const spy = jest.spyOn(Game.prototype, 'handleGuess');
//   const tile = wrapper.find(TileContent).first().find(Paper);
//   tile.simulate('click');
//   expect(spy).toHaveBeenCalled();
// })
