import * as React from 'react';

import { createShallow, createMount } from '@material-ui/core/test-utils';

import Paper from '@material-ui/core/Paper';

import TurnIndicator from '../TurnIndicator/TurnIndicator';
import PlayerToggle from '../PlayerToggle/PlayerToggle';
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay';
import GameGrid from '../GameGrid/GameGrid';
import EndTurnButton from '../EndTurnButton/EndTurnButton';
import NewGameWidget from '../NewGameWidget/NewGameWidget';

import Game, { GroupedWord } from './Game';

const DEFAULT_STATE = {
  playerType: "player",
  turn: "red",
  winner: "",
  remaining: {
    red: 9,
    blue: 8
  },
  groupedWords: [],  // as GroupedWord[],
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

it('creates a new game with default state, but new words and new ptKey', () => {
  const wrapper = setup();
  wrapper.setState({
    playerType: "spymaster",
    turn: "blue",
    winner: "blue",
    remaining: {
      red: 3,
      blue: 0
    }
  });  // Changing all the things that are revertible.
  const inst = wrapper.instance() as any;
  const prevStateGWs = JSON.parse(JSON.stringify(wrapper.state().groupedWords));
  inst.createNewGame();
  expect(wrapper.state().turn).toBe(DEFAULT_STATE.turn);
  expect(wrapper.state().playerType).toBe(DEFAULT_STATE.playerType);
  expect(wrapper.state().winner).toBe(DEFAULT_STATE.winner);
  expect(wrapper.state().remaining).toEqual(DEFAULT_STATE.remaining);
  expect(wrapper.state().groupedWords).not.toEqual(prevStateGWs);
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

it('does not change groupedWords state on click if playertype is spymaster', () => {
  const wrapper = setup();
  wrapper.setState({ playerType: "spymaster" });
  const prevState = JSON.parse(JSON.stringify(wrapper.state()));
  const inst = wrapper.instance() as any;
  const rw = wrapper.state().groupedWords.find((i: GroupedWord) => i.group === "red");
  inst.handleGuess({ currentTarget: { textContent: rw.word } });
  expect(prevState).toEqual(wrapper.state());
});

it('does not change groupedWords state on click if tile already guessed', () => {
  const wrapper = setup();
  const inst = wrapper.instance() as any;
  const rw = wrapper.state().groupedWords.find((i: GroupedWord) => i.group === "red");
  inst.handleGuess({ currentTarget: { textContent: rw.word } });
  const prevState = JSON.parse(JSON.stringify(wrapper.state()));
  const rw2 = wrapper.state().groupedWords.find((i: GroupedWord) => i.group === "red");
  inst.handleGuess({ currentTarget: { textContent: rw2.word } });
  expect(prevState).toEqual(wrapper.state());
});

it('does not allow TileContent clicks after game is over', () => {
  const wrapper = setup();
  wrapper.setState({ winner : "red" });
  const prevState = JSON.parse(JSON.stringify(wrapper.state()));
  const inst = wrapper.instance() as any;
  const neutral = wrapper.state().groupedWords.find((i: GroupedWord) => i.group === "neutral");
  inst.handleGuess({ currentTarget: { textContent: neutral.word } });
  expect(prevState).toEqual(wrapper.state());
});

it('the other team wins if death card picked', () => {
  const wrapper = setup();
  const inst = wrapper.instance() as any;
  const dc = wrapper.state().groupedWords.find((i: GroupedWord) => i.group === "death");
  inst.handleGuess({ currentTarget: { textContent: dc.word } });
  expect(wrapper.state().winner).toBe("blue");
});

it('toggles turn if neutral guessed', () => {
  const wrapper = setup();
  const inst = wrapper.instance() as any;
  const neutral = wrapper.state().groupedWords.find((i: GroupedWord) => i.group === "neutral");
  inst.handleGuess({ currentTarget: { textContent: neutral.word } });
  expect(wrapper.state().turn).toBe("blue");
  const neutral2 = wrapper.state().groupedWords.filter((i: GroupedWord) => i.group === "neutral")[1];
  inst.handleGuess({ currentTarget: { textContent: neutral2.word } });
  expect(wrapper.state().turn).toBe("red");
});

it('decrements score on color guess', () => {
  const wrapper = setup();
  const prevRedCount = wrapper.state().remaining.red;
  const prevBlueCount = wrapper.state().remaining.blue;
  const inst = wrapper.instance() as any;
  const rw = wrapper.state().groupedWords.find((i: GroupedWord) => i.group === "red");
  inst.handleGuess({ currentTarget: { textContent: rw.word } });
  expect(wrapper.state().remaining.red).toBe(prevRedCount - 1);
  const bw = wrapper.state().groupedWords.find((i: GroupedWord) => i.group === "blue");
  inst.handleGuess({ currentTarget: { textContent: bw.word } });
  expect(wrapper.state().remaining.blue).toBe(prevBlueCount - 1);
});

it('switches turn if other team\'s color guessed', () => {
  const wrapper = setup();
  const inst = wrapper.instance() as any;
  const bw = wrapper.state().groupedWords.find((i: GroupedWord) => i.group === "blue");
  inst.handleGuess({ currentTarget: { textContent: bw.word } });
  expect(wrapper.state().turn).toBe("blue");
  const rw = wrapper.state().groupedWords.find((i: GroupedWord) => i.group === "red");
  inst.handleGuess({ currentTarget: { textContent: rw.word } });
  expect(wrapper.state().turn).toBe("red");
});

it('marks game as won if counter reaches zero', () => {
  const wrapper = setup();
  wrapper.setState({ remaining: {red: 1, blue: 5 }});
  const inst = wrapper.instance() as any;
  const rw = wrapper.state().groupedWords.find((i: GroupedWord) => i.group === "red");
  inst.handleGuess({ currentTarget: { textContent: rw.word } });
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
  expect(ngw.props().newGameHandler).toBe(inst.createNewGame);
});

it('displays Paper as top level element', () => {
  const wrapper = setup();
  expect(wrapper.childAt(0).is(Paper)).toBeTruthy();
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
