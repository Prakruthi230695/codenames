import * as React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import TurnIndicator from './TurnIndicator';


type PropOverrides = {
  turn?: 'red' | 'blue',
  winner?: '' | 'red' | 'blue',
}

type Props = {
  turn: 'red' | 'blue',
  winner: '' | 'red' | 'blue',
}


const setup = (propOverrides?: PropOverrides) => {
  const props: Props = Object.assign({
    turn: 'red',
    winner: ''
  }, propOverrides);

  let shallow = createShallow({untilSelector: 'TurnIndicator'}); // b/c withStyles HOC
  const wrapper = shallow(<TurnIndicator {...props} />);
  return wrapper;
};


it('renders without crashing', () => {
  setup();
});
