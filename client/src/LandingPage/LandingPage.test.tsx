import * as React from 'react';

import { createShallow } from '@material-ui/core/test-utils';

import LandingPage from './LandingPage';

it('renders without crashing', () => {
  const shallow = createShallow({untilSelector: 'LandingPage'});
  shallow(<LandingPage />);

});
