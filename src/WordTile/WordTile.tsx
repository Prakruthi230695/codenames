import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { WithStyles } from '@material-ui/core';

import GridListTile from '@material-ui/core/GridListTile';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';


const styles = (theme: Theme) => createStyles({
});

interface Props extends WithStyles<typeof styles> {
  groupedWord: {
    word: string,
    group: "red" | "blue" | "neutral" | "death"
  },
  playerType: "player" | "spymaster",
  handleGuess(e: any): void
}

interface State {
  guessed: boolean
}


class WordTile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      guessed: false
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: any): void {
    if (!this.state.guessed) {
      this.setState({ guessed: true });
      this.props.handleGuess(e);
    }
  }

  render() {
    return (
      <GridListTile onClick={this.handleClick}>
        <Paper>
          <Typography>
            {this.props.groupedWord.word}
          </Typography>
        </Paper>
      </GridListTile>
    )
  }
}

export default withStyles(styles)(WordTile);
