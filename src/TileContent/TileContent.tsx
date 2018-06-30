import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { WithStyles } from '@material-ui/core';
import purple from '@material-ui/core/colors/purple';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { GroupedWord, PlayerType } from '../Game/Game';


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

  CursorGuessedOrSpymaster = "cursorGuessedOrSpymaster",
  CursorPlayerUnguessed = "cursorPlayerUnguessed",
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

  [ClassNames.CursorPlayerUnguessed]: {
    cursor: "pointer",
  },
  [ClassNames.CursorGuessedOrSpymaster]: {
    cursor: "default",
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
  playerType: PlayerType,
  handleGuess(e: React.MouseEvent<HTMLDivElement>): void
}

class TileContent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.generatePaperColorClassKey = this.generatePaperColorClassKey.bind(this);
    this.generateTextColorClassKey = this.generateTextColorClassKey.bind(this);
    this.generateCursorClassKey = this.generateCursorClassKey.bind(this);
  }

  // handleClick(e: any): void {
  //   console.log(e.currentTarget.textContent);
  //   if (this.props.playerType !== "spymaster" && !this.state.guessed) {
  //     this.setState({ guessed: true });
  //     this.props.handleGuess(this.props.groupedWord.group);
  //   }
  // }

  generateCursorClassKey(): string {
    const { groupedWord, playerType } = this.props;

    if (groupedWord.guessed || playerType === "spymaster") {
      return ClassNames.CursorGuessedOrSpymaster;
    } else {
      return ClassNames.CursorPlayerUnguessed;
    }
  }

  /* The following two generate...() methods are to navigate the myriad
   * coloring options available for a tile.
   */
  generatePaperColorClassKey(): string {
    const { groupedWord, playerType } = this.props;

    if (groupedWord.guessed) {
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

  generateTextColorClassKey(): string {
    const { groupedWord, playerType } = this.props;

    if (groupedWord.guessed) {
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
    const { groupedWord, handleGuess, classes } = this.props;

    // Do I want this / the generate...() methods typed as ClassNames?
    const paperColorClassKey: string = this.generatePaperColorClassKey();
    const paperColorClass: string = classes[paperColorClassKey];
    const cursorClass: string = this.generateCursorClassKey();
    const cursorClassKey: string = classes[cursorClass];
    const paperClasses: string = paperColorClass + " " + classes.paperLayout + " " + cursorClassKey;

    const textColorClassKey: string = this.generateTextColorClassKey();
    const textColorClass: string = classes[textColorClassKey];
    const textClasses: string = textColorClass + " " + classes.textLayout;

    return (
      <Paper
        className={paperClasses}
        onClick={handleGuess}
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
