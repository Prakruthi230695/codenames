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
    this.handleNewGame = this.handleNewGame.bind(this);
    this.createNewGame = this.createNewGame.bind(this);
    this.toggleTurn = this.toggleTurn.bind(this);
    this.onGuess = this.onGuess.bind(this);
    this.restoreDefaultState = this.restoreDefaultState.bind(this);
    this.generateGroupedWords = this.generateGroupedWords.bind(this);
  }

  componentDidMount() {
    this.socket = io();

    this.socket.on('endTurn', () => {
      this.toggleTurn();
    });
    this.socket.on('guess', (groupedWord: GroupedWord) => {
      this.onGuess(groupedWord);
    });
    this.socket.on('newGame', (groupedWords: GroupedWord[]) => {
      this.restoreDefaultState();
      this.setState({ groupedWords });
    });
    // called only if no other players in the namespace.
    this.socket.on('createNewGame', () => {
      this.createNewGame();
    });
    /* needGameData and joiningGame are both part of joining a preexisting game.
     * needGameData responds to a socket.io emit that is triggered upon a new
     * player connecting to a namespace with a preexisting game.
     * joiningGame handles the server-side emit that results from the
     * needGameData emit of joiningGame.
    */
    this.socket.on('needGameData', (newPlayerID: string) => {
      const gameData: Pick<State, 'turn' | 'winner' | 'remaining' | 'groupedWords'> = {
        turn: this.state.turn,
        winner: this.state.winner,
        remaining: this.state.remaining,
        groupedWords: this.state.groupedWords
      };
      this.socket.emit('joiningGame', gameData, newPlayerID);
    });
    this.socket.on('joiningGame', (gameData: Pick<State, 'turn' | 'winner' | 'remaining' | 'groupedWords'>) => {
      this.setState({
        turn: gameData.turn,
        winner: gameData.winner,
        remaining: gameData.remaining,
        groupedWords: gameData.groupedWords
      });
    });
  }

  createNewGame(): void {
    this.restoreDefaultState();
    this.generateGroupedWords();
  }

  handleNewGame(): void {
    this.createNewGame();
    this.setState(() => {  // Dummy stateChange fn so that I can use the callback feature.
        return {};
      },
      // Callback called after state is updated.
      () => {
        this.socket.emit('newGame', this.state.groupedWords);
      }
    );
  }

  restoreDefaultState(): void {
    this.setState({
      playerType: "player",
      turn: "red",
      winner: "",
      remaining: {
        red: 9,
        blue: 8
      },
      groupedWords: [],
      playerToggleKey: Math.random()
    });
  }

  generateGroupedWords(): void {
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

  toggleTurn(): void {
    this.setState((prevState) => {
      const turn: Turn = prevState.turn === "red" ? "blue" : "red";
      return { turn };
    });
  }

  endTurnHandler(): void {
    this.socket.emit('endTurn');
    this.toggleTurn();
  }

  onGuess(clickedTileGroup: GroupedWord): void {
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
      this.toggleTurn();
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

  handleGuess(e: React.MouseEvent<HTMLDivElement>): void {
    const word: string = e.currentTarget.textContent as string;
    const stateTileGroup: GroupedWord = this.state.groupedWords.filter(gw => gw.word === word)[0];  // The filter should return a single GroupedWord
    const clickedTileGroup: GroupedWord = Object.assign({}, stateTileGroup);  // Clones so that I don't mutate the state.

    if (this.state.playerType === "spymaster" ||
        clickedTileGroup.guessed ||
        !!this.state.winner) {
      return;
    }
    // Don't want to do this stuff until I've checked the above conditions.
    this.onGuess(clickedTileGroup);
    this.socket.emit('guess', clickedTileGroup);
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
            newGameHandler={this.handleNewGame}
          />
        </div>
      </Paper>
    )
  }
}

export default withStyles(styles)(Game);
