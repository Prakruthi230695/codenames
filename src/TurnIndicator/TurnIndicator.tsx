import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { WithStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const styles = (theme: Theme) => createStyles({
  blue: {
    color: theme.palette.secondary.main
  },
  red: {
    color: theme.palette.primary.main
  }
});

interface Props extends WithStyles<typeof styles> {
  turn: 'red' | 'blue',
  winner: '' | 'red' | 'blue',
}

const TurnIndicator: React.SFC<Props> = (props: Props) => {
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
}

export default withStyles(styles)(TurnIndicator);
