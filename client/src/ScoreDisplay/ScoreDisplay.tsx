import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import { Remaining } from '../Game/Game';

const styles = createStyles({
  root: {
    display: 'inline-block'
  },
  spacer: {
    display: 'inline-block',
    paddingLeft: 4,
    paddingRight: 4
  }
});

interface Props extends WithStyles<typeof styles> {
  remaining: Remaining
}

const ScoreDisplay: React.SFC<Props> = (props: Props) => {
  const { remaining, classes } = props;

  return (
    <span>
      <Typography
        className={classes.root}
        color="primary"
        variant="headline"
      >
        {remaining.red}
      </Typography>
      <Typography
        className={classes.spacer}
        variant="headline"
      >
        {"·"}
      </Typography>
      <Typography
        className={classes.root}
        color="secondary"
        variant="headline"
      >
        {remaining.blue}
      </Typography>
    </span>
  )
}

export default withStyles(styles)(ScoreDisplay);
