import * as React from 'react';

// import { createShallow } from '@material-ui/core/test-utils';
import { shallow } from 'enzyme';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

import NewGameWidget from './NewGameWidget';

type Props = {
  winner: '' | 'red' | 'blue',
  newGameHandler: jest.Mock
}


const setup = (propOverrides?: Partial<Props>) => {
  const props: Props = Object.assign({
    winner: '',
    newGameHandler: jest.fn()
  }, propOverrides);

  // const shallow = createShallow({untilSelector: 'NewGameWidget'});
  const wrapper = shallow(<NewGameWidget {...props} />);
  return wrapper;
};

it('renders without crashing', () => {
  setup();
});

it('displays a New Game button', () => {
  const wrapper = setup();
  const children = wrapper.children(Button);
  expect(children.length).toBe(1);
});

it('calls newGameHandler if game won', () => {
  const spy = jest.fn();
  const wrapper = setup({newGameHandler: spy, winner: "red"});
  const ngBtn = wrapper.children(Button);
  ngBtn.simulate('click');
  expect(spy).toHaveBeenCalled();
});

it('does not call newGameHandler if game not won', () => {
  const spy = jest.fn();
  const wrapper = setup({newGameHandler: spy, winner: ""});
  const ngBtn = wrapper.children(Button);
  ngBtn.simulate('click');
  expect(spy).not.toHaveBeenCalled();
});

it('displays dialog only if new game btn click and game not done', () => {
  const wrapper = setup();
  expect(wrapper.find(Dialog).props().open).toBeFalsy();
  const ngBtn = wrapper.children(Button);
  ngBtn.simulate('click');
  expect(wrapper.find(Dialog).props().open).toBeTruthy();
});

it('hides dialog if dialog\'s close btn clicked', () => {
  const wrapper = setup();
  const ngBtn = wrapper.children(Button);
  ngBtn.simulate('click');
  expect(wrapper.find(Dialog).props().open).toBeTruthy();

  const dialogBtns = wrapper.find(DialogActions).find(Button);
  const closeBtn = dialogBtns.first();
  closeBtn.simulate('click');
  expect(wrapper.find(Dialog).props().open).toBeFalsy();
});

it('calls newGameHandler on dialog confirm click', () => {
  const spy = jest.fn();
  const wrapper = setup({newGameHandler: spy, winner: ""});
  const ngBtn = wrapper.children(Button);
  ngBtn.simulate('click');

  const dialogBtns = wrapper.find(DialogActions).find(Button);
  const confirmBtn = dialogBtns.last();
  confirmBtn.simulate('click');
  expect(spy).toHaveBeenCalled();
});

it('closes dialog on confirm click', () => {
  const spy = jest.fn();
  const wrapper = setup({newGameHandler: spy, winner: ""});
  const ngBtn = wrapper.children(Button);
  ngBtn.simulate('click');

  const dialogBtns = wrapper.find(DialogActions).find(Button);
  const confirmBtn = dialogBtns.last();
  confirmBtn.simulate('click');
  expect(wrapper.find(Dialog).props().open).toBeFalsy();
});
