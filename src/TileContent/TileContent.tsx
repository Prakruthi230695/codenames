import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { WithStyles } from '@material-ui/core';
import purple from '@material-ui/core/colors/purple';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { Group, GroupedWord } from '../GameGrid/GameGrid';


enum ClassNames {
  TextGuessed = "textGuessed",
  TextSpymasterUnguessedRed = "textSpymasterUnguessedRed",
  TextSpymasterUnguessedBlue = "textSpymasterUnguessedBlue",
  TextSpymasterUnguessedDeath = "textSpymasterUnguessedDeath",
  TextDefault = "textDefault",

  PaperSpymasterUnguessedDeath = "paperSpymasterUnguessedDeath",
  PaperGuessedRed = "paperGuessedRed",
  PaperGuessedBlue = "paperGuessedBlue",
  PaperGuessedDeath = "paperGuessedDeath",
  PaperGuessedNeutral = "paperGuessedNeutral",
  PaperDefault = "paperDefault",
}

const styles = (theme: Theme) => createStyles({
  [ClassNames.TextDefault]: {},
  [ClassNames.TextGuessed]: {
    color: theme.palette.common.white,
  },
  [ClassNames.TextSpymasterUnguessedRed]: {
    color: theme.palette.primary.main,
  },
  [ClassNames.TextSpymasterUnguessedBlue]: {
    color: theme.palette.secondary.main,
  },
  [ClassNames.TextSpymasterUnguessedDeath]: {
    color: theme.palette.common.white,
  },

  [ClassNames.PaperDefault]: {
    backgroundColor: theme.palette.grey[300],
  },
  [ClassNames.PaperSpymasterUnguessedDeath]: {
    backgroundColor: purple[900],
  },
  [ClassNames.PaperGuessedRed]: {
    backgroundColor: theme.palette.primary.dark,
  },
  [ClassNames.PaperGuessedBlue]: {
    backgroundColor: theme.palette.secondary.dark,
  },
  [ClassNames.PaperGuessedNeutral]: {
    backgroundColor: theme.palette.grey[600],
  },
  [ClassNames.PaperGuessedDeath]: {
    backgroundColor: theme.palette.common.black,
  },

  textLayout: {
    wordBreak: 'break-all',
    padding: 5
  },

  paperLayout: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'inherit',
    height: 'inherit'
  }
});

interface Props extends WithStyles<typeof styles> {
  groupedWord: GroupedWord,
  playerType: "player" | "spymaster",
  handleGuess(tileGroup: Group): void
}

interface State {
  guessed: boolean
}


class TileContent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      guessed: false
    }

    this.handleClick = this.handleClick.bind(this);
    this.generatePaperColorClass = this.generatePaperColorClass.bind(this);
    this.generateTextColorClass = this.generateTextColorClass.bind(this);
  }

  handleClick(): void {
    if (this.props.playerType !== "spymaster" && !this.state.guessed) {
      this.setState({ guessed: true });
      this.props.handleGuess(this.props.groupedWord.group);
    }
  }

  /* The following two generate...() methods are to navigate the myriad
   * coloring options available for a tile.
   */
  generatePaperColorClass(): string {
    const { groupedWord, playerType } = this.props;
    const { guessed } = this.state;

    if (guessed) {
      if (groupedWord.group === "red") {
        return ClassNames.PaperGuessedRed;
      } else if (groupedWord.group === "blue") {
        return ClassNames.PaperGuessedBlue;
      } else if (groupedWord.group === "neutral") {
        return ClassNames.PaperGuessedNeutral;
      } else {
        return ClassNames.PaperGuessedDeath;
      }
    } else if (playerType === "spymaster" && groupedWord.group === "death") {
      return ClassNames.PaperSpymasterUnguessedDeath;
    } else {
      return ClassNames.PaperDefault;
    }
  }

  generateTextColorClass(): string {
    const { groupedWord, playerType } = this.props;
    const { guessed } = this.state;

    if (guessed) {
        return ClassNames.TextGuessed;
    } else if (playerType === "spymaster") {
      if (groupedWord.group === "red") {
        return ClassNames.TextSpymasterUnguessedRed;
      } else if (groupedWord.group === "blue") {
        return ClassNames.TextSpymasterUnguessedBlue;
      } else if (groupedWord.group === "death") {
        return ClassNames.TextSpymasterUnguessedDeath;
      }
    }
    return ClassNames.TextDefault;
  }

  render() {
    const { groupedWord, classes } = this.props;

    // Do I want this / the generate...() methods typed as ClassNames?
    const paperColorClassKey: string = this.generatePaperColorClass();
    const paperColorClass: string = classes[paperColorClassKey];
    const paperClasses: string = paperColorClass + " " + classes.paperLayout;

    const textColorClassKey: string = this.generateTextColorClass();
    const textColorClass: string = classes[textColorClassKey];
    const textClasses: string = textColorClass + " " + classes.textLayout;

    return (
      <Paper
        className={paperClasses}
        onClick={this.handleClick}
        >
        <Typography
          className={textClasses}
          variant={"button"}
          align={"center"}
        >
          {groupedWord.word}
        </Typography>
      </Paper>
    )
  }
}

export default withStyles(styles)(TileContent);
