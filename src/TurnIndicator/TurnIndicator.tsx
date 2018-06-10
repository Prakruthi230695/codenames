import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import Typography from '@material-ui/core/Typography';
import { WithStyles } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';

const styles = (theme: Theme) => createStyles({
  blue: {
    color: blue[500]
  },
  red: {
    color: red[500]
  }
});

interface Props extends WithStyles<typeof styles> {
  turn: 'red' | 'blue',
  winner: '' | 'red' | 'blue',
}

const TurnIndicator = withStyles(styles)((props: Props) => {
  const { turn, winner, classes } = props;
  const color: string = winner || turn;
  let text: string;

  if (winner) {
    text = winner === 'red' ? 'RED WINS!' : 'BLUE WINS!';
  } else {
    text = turn === 'red' ? 'RED\'S TURN' : 'BLUE\'S TURN';
  };

  return (
    <Typography
      variant={winner ? 'display2' : 'display1'}
      gutterBottom
      className={classes[color]}
    >
      {text}
    </Typography>
  )
})

export default TurnIndicator;
