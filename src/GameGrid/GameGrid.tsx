import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';


import { shuffle } from '../utils';
import WORDBANK from '../WORDBANK';

import TileContent from '../TileContent/TileContent';


const DIM: number = 5;
const TILE_WIDTH: number = 120;
const TILE_HEIGHT: number = 80;

const styles = createStyles({
  grid: {
    width: (TILE_WIDTH + 4) * DIM,  // 4px is default spacing.
  }
});

export interface GroupedWord {
    word: string,
    group: "red" | "blue" | "neutral" | "death"
}

interface Props extends WithStyles<typeof styles> {
  playerType: "player" | "spymaster",
  handleGuess(e: any): void
}

interface State {
  groupedWords: GroupedWord[]
}


class GameGrid extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      groupedWords: []  // as GroupedWord[]
    }
  }

  /** Populates the set of words for the game. */
  componentDidMount() {
    shuffle(WORDBANK);
    const gameWords: string[] = WORDBANK.slice(0, 25);
    const groupedWords: GroupedWord[] = [];

    for (const word of gameWords) {
      // TODO: convert magic numbers.
      const group = groupedWords.length < 9  ? "red"     :
                    groupedWords.length < 17 ? "blue"    :
                    groupedWords.length < 24 ? "neutral" : "death";
      const groupedWord: GroupedWord = { word, group };
      groupedWords.push(groupedWord);
    }
    shuffle(groupedWords);

    this.setState({ groupedWords });
  }

  render() {
    const { groupedWords } = this.state;
    const { playerType, handleGuess, classes } = this.props;
    return (
      <div className={classes.grid}>
        <GridList
          cellHeight={TILE_HEIGHT}
          cols={DIM}
        >
          {groupedWords.map(groupedWord => (
            <GridListTile
              key={groupedWord.word}
            >
              <TileContent
                groupedWord={groupedWord}
                playerType={playerType}
                handleGuess={handleGuess}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

export default withStyles(styles)(GameGrid);
