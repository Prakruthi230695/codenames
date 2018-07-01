import * as React from 'react';

import { createShallow } from '@material-ui/core/test-utils';

import RadioGroup from '@material-ui/core/RadioGroup';

import PlayerToggle from './PlayerToggle';

type Props = {
  togglePlayerType: jest.Mock
}


const setup = (propOverrides?: Partial<Props>) => {
  const props: Props = Object.assign({
    togglePlayerType: jest.fn()
  }, propOverrides);

  const shallow = createShallow({untilSelector: 'PlayerToggle'});
  const wrapper = shallow(<PlayerToggle {...props} />);
  return wrapper;
};

it('renders without crashing', () => {
  setup();
});

it('defaults to being a \'player\'', () => {
  const wrapper = setup();
  expect(wrapper.find(RadioGroup).props().value).toBe('player');
});

it('toggles between player types', () => {
  const wrapper = setup();
  const radioGroup = wrapper.find(RadioGroup);
  radioGroup.simulate('change', {currentTarget: {value: 'spymaster'}} );
  expect(wrapper.find(RadioGroup).props().value).toBe('spymaster');
  radioGroup.simulate('change', {currentTarget: {value: 'player'}} );
  expect(wrapper.find(RadioGroup).props().value).toBe('player');
});

it('calls togglePlayerType on change', () => {
  const spy = jest.fn();
  const wrapper = setup({togglePlayerType: spy});
  const radioGroup = wrapper.find(RadioGroup);
  radioGroup.simulate('change', {currentTarget: {value: 'spymaster'}} );
  expect(spy).toHaveBeenCalled();
});
