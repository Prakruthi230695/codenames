import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { TOTAL_WIDTH } from '../Game/Game';


const styles = createStyles({
  root: {
    margin: "20px auto 20px",
    width: "100%",
    maxWidth: TOTAL_WIDTH,
  },
  bottomPadding: {
    paddingBottom: 5,
  },
  sidePadding: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});

interface Props extends WithStyles<typeof styles> { }

const LandingPage: React.SFC<Props> = (props: Props) => {
  const { classes } = props;

  return (
  <Paper className={classes.root}>
      <Typography
        variant={"display1"}
        align={"center"}
        color={"secondary"}
        gutterBottom
      >
        {"Welcome to Codenames!"}
      </Typography>
      <Typography
        className={classes.sidePadding}
        variant={"headline"}
        align={"center"}
        gutterBottom
      >
        {`Navigate to any path (the part after \".com/\") to set-up a game,
          and share the link with your friends!
        `}
      </Typography>
      <Typography
        variant={"caption"}
        align={"center"}
      >
        {"Examples:"}
      </Typography>
      <Typography
        align={"center"}
      >
        {window.location.host + "/marzipan"}
      </Typography>
      <Typography
        align={"center"}
        className={classes.bottomPadding}
      >
        {window.location.host + "/tsarbomba"}
      </Typography>

    </Paper>
  )
}

export default withStyles(styles)(LandingPage);
