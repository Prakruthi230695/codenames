import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import TurnIndicator from '../TurnIndicator/TurnIndicator';
import PlayerToggle from '../PlayerToggle/PlayerToggle';
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay';
import GameGrid from '../GameGrid/GameGrid';
import EndTurnButton from '../EndTurnButton/EndTurnButton';
import NewGameWidget from '../NewGameWidget/NewGameWidget';

import { Group } from '../GameGrid/GameGrid';


const styles = createStyles({
  game: {}
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
    if (this.state.playerType === "spymaster") {
      return;
    }

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
    const { newGameHandler } = this.props;
    const {
      playerType,
      turn,
      winner,
      remaining
    } = this.state;

    return (
      <React.Fragment>
        <TurnIndicator
          turn={turn}
          winner={winner}
        />
        <PlayerToggle
          togglePlayerType={this.togglePlayerType}
        />
        <ScoreDisplay
          remaining={remaining}
        />
        <GameGrid
          playerType={playerType}
          handleGuess={this.handleGuess}
        />
        <EndTurnButton
          winner={winner}
          endTurnHandler={this.endTurnHandler}
        />
        <NewGameWidget
          winner={winner}
          newGameHandler={newGameHandler}
        />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Game);
