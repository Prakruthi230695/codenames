import * as React from 'react';

import { createShallow } from '@material-ui/core/test-utils';

import Paper from '@material-ui/core/Paper';

import TurnIndicator from '../TurnIndicator/TurnIndicator';
import PlayerToggle from '../PlayerToggle/PlayerToggle';
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay';
import GameGrid from '../GameGrid/GameGrid';
import EndTurnButton from '../EndTurnButton/EndTurnButton';
import NewGameWidget from '../NewGameWidget/NewGameWidget';

import Game from './Game';


interface Props {
  newGameHandler(e: React.MouseEvent<HTMLButtonElement>): void
};

const setup = (propOverrides?: Partial<Props>) => {
  const props: Props = Object.assign({
    newGameHandler: jest.fn()
  }, propOverrides);

  const shallow = createShallow({untilSelector: 'Game'});
  const wrapper = shallow(<Game {...props} />);
  return wrapper;
};

it('renders without crashing', () => {
  setup();
});

it('toggles turns via endTurnHandler', () => {
  const wrapper = setup();
  expect(wrapper.state().turn).toBe("red");
  const inst = wrapper.instance() as any;  // NB: casting to any circumvents errors.
  inst.endTurnHandler();
  expect(wrapper.state().turn).toBe("blue");
  inst.endTurnHandler();
  expect(wrapper.state().turn).toBe("red");
});

it('changes player via togglePlayerType', () => {
  const wrapper = setup();
  expect(wrapper.state().playerType).toBe("player");
  const inst = wrapper.instance() as any;
  inst.togglePlayerType({currentTarget: {value: "spymaster"}});
  expect(wrapper.state().playerType).toBe("spymaster");
  inst.togglePlayerType({currentTarget: {value: "player"}});
  expect(wrapper.state().playerType).toBe("player");
});

it('does not change state if playertype is spymaster', () => {
  const wrapper = setup();
  wrapper.setState({ playerType: "spymaster" });
  const prevState = wrapper.state();
  const inst = wrapper.instance() as any;
  inst.handleGuess("red");
  expect(prevState).toEqual(wrapper.state());
});

it('the other team wins if death card picked', () => {
  const wrapper = setup();
  const inst = wrapper.instance() as any;
  inst.handleGuess("death");
  expect(wrapper.state().winner).toBe("blue");
});

it('toggles turn if neutral guessed', () => {
  const wrapper = setup();
  const inst = wrapper.instance() as any;
  inst.handleGuess("neutral");
  expect(wrapper.state().turn).toBe("blue");
  inst.handleGuess("neutral");
  expect(wrapper.state().turn).toBe("red");
});

it('decrements score on color guess', () => {
  const wrapper = setup();
  const prevRedCount = wrapper.state().remaining.red;
  const prevBlueCount = wrapper.state().remaining.blue;
  const inst = wrapper.instance() as any;
  inst.handleGuess("red");
  expect(wrapper.state().remaining.red).toBe(prevRedCount - 1);
  inst.handleGuess("blue");
  expect(wrapper.state().remaining.blue).toBe(prevBlueCount - 1);
});

it('switches turn if other team\'s color guessed', () => {
  const wrapper = setup();
  const inst = wrapper.instance() as any;
  inst.handleGuess("blue");
  expect(wrapper.state().turn).toBe("blue");
  inst.handleGuess("red");
  expect(wrapper.state().turn).toBe("red");
});

it('marks game as won if counter reaches zero', () => {
  const wrapper = setup();
  wrapper.setState({ remaining: {red: 1, blue: 5 }});
  const inst = wrapper.instance() as any;
  inst.handleGuess("red");
  expect(wrapper.state().winner).toBe("red");
});

it('passes shit to TurnIndicator', () => {
  const wrapper = setup();
  const ti = wrapper.find(TurnIndicator);
  expect(ti.props().turn).toBe(wrapper.state().turn);
  expect(ti.props().winner).toBe(wrapper.state().winner);
});

it('passes shit to PlayerToggle', () => {
  const wrapper = setup();
  const pt = wrapper.find(PlayerToggle);
  const inst = wrapper.instance() as any;
  expect(pt.props().togglePlayerType).toBe(inst.togglePlayerType);
});

it('passes shit to ScoreDisplay', () => {
  const wrapper = setup();
  const sd = wrapper.find(ScoreDisplay);
  expect(sd.props().remaining).toEqual(wrapper.state().remaining);
});

it('passes shit to GameGrid', () => {
  const wrapper = setup();
  const gg = wrapper.find(GameGrid);
  const inst = wrapper.instance() as any;
  expect(gg.props().playerType).toBe(wrapper.state().playerType);
  expect(gg.props().handleGuess).toBe(inst.handleGuess);
});

it('passes shit to EndTurnButton', () => {
  const wrapper = setup();
  const etb = wrapper.find(EndTurnButton);
  const inst = wrapper.instance() as any;
  expect(etb.props().winner).toBe(wrapper.state().winner);
  expect(etb.props().endTurnHandler).toBe(inst.endTurnHandler);
});

it('passes shit to NewGameWidget', () => {
  const wrapper = setup();
  const ngw = wrapper.find(NewGameWidget);
  const inst = wrapper.instance() as any;
  expect(ngw.props().winner).toBe(wrapper.state().winner);
  expect(ngw.props().newGameHandler).toBe(inst.props.newGameHandler);
});

it('displays Paper as top level element', () => {
  const wrapper = setup();
  expect(wrapper.is(Paper)).toBeTruthy();
});
