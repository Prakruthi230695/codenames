import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';


import { shuffle } from '../utils';
import WORDBANK from '../WORDBANK';

import TileContent from '../TileContent/TileContent';


const styles = createStyles({
  grid: {
    width: 620
  },

  gridListTile: {
    width: 120,
    height: 80
  }
});

interface GroupedWord {
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
          cellHeight={"auto"}
          cols={5}
        >
          {groupedWords.map(groupedWord => (
            <GridListTile
              key={groupedWord.word}
              className={classes.gridListTile}
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
