import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

import TileContent from '../TileContent/TileContent';
import { GroupedWord, PlayerType, Winner } from '../Game/Game';


const DIM: number = 5;
const TILE_WIDTH: number = 120;
const TILE_HEIGHT: number = 80;
export const GRID_WIDTH: number = (TILE_WIDTH + 4) * DIM;  // 4px is default spacing.

const styles = createStyles({
  grid: {
    maxWidth: GRID_WIDTH,
  }
});

interface Props extends WithStyles<typeof styles> {
  playerType: PlayerType,
  groupedWords: GroupedWord[],
  winner: Winner,
  handleGuess(e: React.MouseEvent<HTMLDivElement>): void
}

class GameGrid extends React.Component<Props> {
  render() {
    const { playerType, groupedWords, handleGuess, winner, classes } = this.props;
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
                winner={winner}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

export default withStyles(styles)(GameGrid);
