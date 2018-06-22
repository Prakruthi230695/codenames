import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

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
  remaining: {
    red: number,
    blue: number
  }
}

const ScoreDisplay: React.SFC<Props> = (props: Props) => {
  const { remaining, classes } = props;

  return (
    <React.Fragment>
      <Typography
        className={classes.root}
        color="primary"
        gutterBottom
        variant="headline"
      >
        {remaining.red}
      </Typography>
      <Typography
        className={classes.spacer}
        gutterBottom
        variant="headline"
      >
        {"·"}
      </Typography>
      <Typography
        className={classes.root}
        color="secondary"
        gutterBottom
        variant="headline"
      >
        {remaining.blue}
      </Typography>
    </React.Fragment>
  )
}

export default withStyles(styles)(ScoreDisplay);
