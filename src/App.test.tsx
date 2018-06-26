import * as React from 'react';

import { shallow } from 'enzyme';

import Game from './Game/Game';
import App from './App';

it('renders without crashing', () => {
  const app = shallow(<App />);
});

it('increments gameId on newGameHandler call', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.state().gameId).toBe(1);
  const inst = wrapper.instance() as any;
  inst.newGameHandler();
  expect(wrapper.state().gameId).toBe(2);
});

it('passes shit to Game', () => {
  const wrapper = shallow(<App />);
  const inst = wrapper.instance() as any;
  const g = wrapper.find(Game);
  expect(g.props().newGameHandler).toBe(inst.newGameHandler);
});
