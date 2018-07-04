import * as React from 'react';
import * as io from 'socket.io-client';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { WithStyles } from '@material-ui/core';

import TurnIndicator from '../TurnIndicator/TurnIndicator';
import PlayerToggle from '../PlayerToggle/PlayerToggle';
import ScoreDisplay from '../ScoreDisplay/ScoreDisplay';
import GameGrid from '../GameGrid/GameGrid';
import EndTurnButton from '../EndTurnButton/EndTurnButton';
import NewGameWidget from '../NewGameWidget/NewGameWidget';

import { shuffle } from '../utils';
import WORDBANK from '../WORDBANK';

import Paper from '@material-ui/core/Paper';

import { GRID_WIDTH } from '../GameGrid/GameGrid';


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

export type PlayerType = "player" | "spymaster";
type Teams = "red" | "blue";
export type Turn = Teams;
export type Winner = "" | Teams;
export interface Remaining {
  red: number,
  blue: number
}
// Export these so that TileContent can use it in its Props interface
// and handleClick can use Group type.
export type Group = "neutral" | "death" | Teams;
export interface GroupedWord {
    word: string,
    group: Group,
    guessed: boolean
}

interface State {
  playerType: PlayerType,
  turn: Turn,
  winner: Winner,
  remaining: Remaining,
  groupedWords: GroupedWord[],
  playerToggleKey: number,
};

interface Props extends WithStyles<typeof styles> { };

class Game extends React.Component<Props, State> {

  socket: SocketIOClient.Socket;

  constructor(props: Props) {
    super(props);

    this.state = {
      playerType: "player",
      turn: "red",
      winner: "",
      remaining: {
        red: 9,
        blue: 8
      },
      groupedWords: [],  // as GroupedWord[],
      playerToggleKey: 0
    };

    this.togglePlayerType = this.togglePlayerType.bind(this);
    this.endTurnHandler = this.endTurnHandler.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.createNewGame = this.createNewGame.bind(this);
  }

  componentDidMount() {
    this.createNewGame();
    this.socket = io();
  }

  createNewGame() {
    this.setState({
      playerType: "player",
      turn: "red",
      winner: "",
      remaining: {
        red: 9,
        blue: 8
      },
      playerToggleKey: Math.random()
    });

    shuffle(WORDBANK);
    const gameWords: string[] = WORDBANK.slice(0, 25);
    const groupedWords: GroupedWord[] = [];

    for (const word of gameWords) {
      // TODO: convert magic numbers.
      const group = groupedWords.length < 9  ? "red"     :
                    groupedWords.length < 17 ? "blue"    :
                    groupedWords.length < 24 ? "neutral" : "death";
      const groupedWord: GroupedWord = {
        word,
        group,
        guessed: false
      };
      groupedWords.push(groupedWord);
    }
    shuffle(groupedWords);

    this.setState({ groupedWords });
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

  handleGuess(e: React.MouseEvent<HTMLDivElement>): void {
    const word: string = e.currentTarget.textContent as string;
    const stateTileGroup: GroupedWord = this.state.groupedWords.filter(gw => gw.word === word)[0];  // The filter should return a single GroupedWord
    const clickedTileGroup: GroupedWord = Object.assign({}, stateTileGroup);  // Clones so that I don't mutate the state.

    if (this.state.playerType === "spymaster" ||
        clickedTileGroup.guessed ||
        !!this.state.winner) {
      return;
    }
    // Need to mark it as guessed no matter what.
    this.setState((prevState) => {
      clickedTileGroup.guessed = true;

      const clonedPrevState: GroupedWord[] = prevState.groupedWords.map(gw => Object.assign({}, gw));
      const index: number = clonedPrevState.findIndex(gw => gw.word === clickedTileGroup.word);
      clonedPrevState[index] = clickedTileGroup;
      return { groupedWords: clonedPrevState };
    });

    if (clickedTileGroup.group === "death") {
      this.setState((prevState) => {
        const winner: Winner = prevState.turn === "red" ? "blue" : "red";
        return { winner };
      });
    } else if (clickedTileGroup.group === "neutral") {
      this.endTurnHandler();  // Just switches whose turn it is.
    } else {
      this.setState((prevState) => {
        let winner: Winner = prevState.winner;
        const remaining: Remaining = Object.assign({}, prevState.remaining);  // Cloning
        const turn: Turn = clickedTileGroup.group as Turn;

        remaining[clickedTileGroup.group] = prevState.remaining[clickedTileGroup.group] - 1;
        if (remaining[clickedTileGroup.group] === 0) {
          winner = clickedTileGroup.group as Winner;
        }
        return { winner, turn, remaining };
      });
    }
  }

  render() {
    const { classes } = this.props;
    const {
      playerType,
      turn,
      winner,
      remaining,
      groupedWords,
      playerToggleKey
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
            groupedWords={groupedWords}
            winner={winner}
          />
        <div className={classes.belowGrid}>
          <PlayerToggle
            key={playerToggleKey}
            togglePlayerType={this.togglePlayerType}
          />
          <NewGameWidget
            winner={winner}
            newGameHandler={this.createNewGame}
          />
        </div>
      </Paper>
    )
  }
}

export default withStyles(styles)(Game);
