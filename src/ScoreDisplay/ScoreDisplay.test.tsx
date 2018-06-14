import * as React from 'react';

import { createShallow } from '@material-ui/core/test-utils';
import Typography from '@material-ui/core/Typography';

import ScoreDisplay from './ScoreDisplay';


type Props = {
  redRemaining: number,
  blueRemaining: number,
}

const setup = (propOverrides?: Partial<Props>) => {
  const props: Props = Object.assign({
    redRemaining: 9,
    blueRemaining: 8
  }, propOverrides);

  // NB: I'll have to change the untiSelector (another arg?) if testing other stuff
  const shallow = createShallow({untilSelector: 'ScoreDisplay'});
  const wrapper = shallow(<ScoreDisplay {...props} />);
  return wrapper;
};

it('renders without crashing', () => {
  setup();
});

it('displays the score', () => {
  const wrapper = setup();
  const scores = ['8', '9'];
  const texts = wrapper.find(Typography).children();  // Gets the actual texts, but as nodes.
  const scoreA = texts.first();
  const scoreB = texts.last();
  expect(scores).toContain(scoreA.text());
  expect(scores).toContain(scoreB.text());
});
