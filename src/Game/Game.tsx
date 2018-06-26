import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import TurnIndicator from '../TurnIndicator/TurnIndicator';
import PlayerToggle from '../PlayerToggle/PlayerToggle';
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay';
import GameGrid from '../GameGrid/GameGrid';
import EndTurnButton from '../EndTurnButton/EndTurnButton';
import NewGameWidget from '../NewGameWidget/NewGameWidget';

import Paper from '@material-ui/core/Paper';

import { GRID_WIDTH, Group } from '../GameGrid/GameGrid';


const PADDING: number = 20;

const styles = createStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: PADDING,
    margin: "20px auto 20px",
    width: "100%",
    maxWidth: (GRID_WIDTH + PADDING * 2)
  },
  aboveGrid: {
    marginBottom: 12,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between"
  },
  belowGrid: {
    marginTop: 12,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between"
  }
});

type PlayerType = "player" | "spymaster";
type Turn = "red" | "blue";
type Winner = "" | "red" | "blue";
interface Remaining {
  red: number,
  blue: number
}

interface State {
  playerType: PlayerType,
  turn: Turn,
  winner: Winner,
  remaining: Remaining,
};

interface Props extends WithStyles<typeof styles> {
  newGameHandler(e: React.MouseEvent<HTMLButtonElement>): void
};

class Game extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      playerType: "player",
      turn: "red",
      winner: "",
      remaining: {
        red: 9,
        blue: 8
      }
    }

    this.togglePlayerType = this.togglePlayerType.bind(this);
    this.endTurnHandler = this.endTurnHandler.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
  }


  togglePlayerType(e: React.FormEvent<HTMLInputElement>): void {
    this.setState({ playerType: e.currentTarget.value as PlayerType });
  }

  endTurnHandler(): void {
    this.setState((prevState) => {
      const turn: Turn = prevState.turn === "red" ? "blue" : "red";
      return { turn };
    });
  }

  handleGuess(tileGroup: Group): void {
    // NB: Have already filtered out "spymster" clicks in TileContent.
    if (tileGroup === "death") {
      this.setState((prevState) => {
        const winner: Winner = prevState.turn === "red" ? "blue" : "red";
        return { winner };
      });
    } else if (tileGroup === "neutral") {
      this.endTurnHandler();  // Just switches whose turn it is.
    } else {
      this.setState((prevState) => {
        let winner: Winner = prevState.winner;
        const remaining: Remaining = prevState.remaining;
        const turn: Turn = tileGroup;

        remaining[tileGroup] = prevState.remaining[tileGroup] - 1;
        if (remaining[tileGroup] === 0) {
          winner = tileGroup;
        }
        return { winner, turn, remaining };
      });
    }
  }

  render() {
    const { newGameHandler, classes } = this.props;
    const {
      playerType,
      turn,
      winner,
      remaining
    } = this.state;

    return (
      <Paper className={classes.root} >
        <TurnIndicator
          turn={turn}
          winner={winner}
        />
        <div className={classes.aboveGrid}>
          <ScoreDisplay
            remaining={remaining}
          />
          <EndTurnButton
            winner={winner}
            endTurnHandler={this.endTurnHandler}
          />
        </div>
          <GameGrid
            playerType={playerType}
            handleGuess={this.handleGuess}
          />
        <div className={classes.belowGrid}>
          <PlayerToggle
            togglePlayerType={this.togglePlayerType}
          />
          <NewGameWidget
            winner={winner}
            newGameHandler={newGameHandler}
          />
        </div>
      </Paper>
    )
  }
}

export default withStyles(styles)(Game);
