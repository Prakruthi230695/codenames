import * as React from 'react';

import { createShallow } from '@material-ui/core/test-utils';

import TurnIndicator from './TurnIndicator';


type Props = {
  turn: 'red' | 'blue',
  winner: '' | 'red' | 'blue',
}


const setup = (propOverrides?: Partial<Props>) => {
  const props: Props = Object.assign({
    turn: 'red',
    winner: ''
  }, propOverrides);

  // NB: I'll have to change the untiSelector (another arg?) if testing other stuff
  const shallow = createShallow({untilSelector: 'Typography'});
  const wrapper = shallow(<TurnIndicator {...props} />);
  return wrapper;
};


it('renders without crashing', () => {
  setup();
});

it('displays the team\'s turn', () => {
  let wrapper = setup({turn: 'blue'});
  expect(wrapper.text().toLowerCase()).toMatch(/blue.+turn/);
  wrapper = setup({turn: 'red'});
  expect(wrapper.text().toLowerCase()).toMatch(/red.+turn/);
});

it('displays when a team has won', () => {
  const wrapper = setup({winner: 'red'});
  expect(wrapper.text().toLowerCase()).toMatch(/w[io]n/);
});
