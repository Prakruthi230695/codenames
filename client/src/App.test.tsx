import * as React from 'react';

import { shallow } from 'enzyme';

import App from './App';
import LandingPage from './LandingPage/LandingPage';

it('renders without crashing', () => {
  shallow(<App />);
});

it('displays LandingPage by default', () => {
  const wrapper = shallow(<App />);
  const lp = wrapper.find(LandingPage);
  expect(lp.length).toBe(1);
});
