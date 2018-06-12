import * as React from 'react';

// import { createShallow } from '@material-ui/core/test-utils';
import { shallow } from 'enzyme';

import Button from '@material-ui/core/Button';

import EndTurnButton from './EndTurnButton';


type Props = {
  endTurnHandler: jest.Mock
}

const setup = () => {
  const props: Props = {
    endTurnHandler: jest.fn()
  };

  // const shallow = createShallow({untilSelector: 'EndTurnButton'});
  const wrapper = shallow(<EndTurnButton {...props} />);
  return wrapper;
};


it('renders without crashing', () => {
  setup();
});

it('calls endTurnHandler on onClick', () => {
  const spy = jest.fn();
  const wrapper = shallow(<EndTurnButton endTurnHandler={spy}/>);
  const btn = wrapper.find(Button).first();
  btn.simulate('click');
  expect(spy).toHaveBeenCalled();
});
