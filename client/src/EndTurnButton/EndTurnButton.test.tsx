import * as React from 'react';

// import { createShallow } from '@material-ui/core/test-utils';
import { shallow } from 'enzyme';

import Button from '@material-ui/core/Button';

import EndTurnButton from './EndTurnButton';


type Props = {
  winner: "" | "red" | "blue",
  endTurnHandler: jest.Mock
}

const setup = () => {
  const props: Props = {
    winner: "",
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
  const wrapper = shallow(<EndTurnButton endTurnHandler={spy} winner={""} />);
  const btn = wrapper.find(Button).first();
  btn.simulate('click');
  expect(spy).toHaveBeenCalled();
});

it('is disabled if game is over', () => {
  const spy = jest.fn();
  const wrapper = shallow(<EndTurnButton endTurnHandler={spy} winner={"red"}/>);
  const btn = wrapper.find(Button).first();
  expect(btn.props().disabled).toBeTruthy();
})
