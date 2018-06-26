import * as React from 'react';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import CssBaseline from '@material-ui/core/CssBaseline';

import Game from './Game/Game';


const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: blue
  }
});

interface State {
  gameId: number
};

class App extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      gameId: 1
    };

    this.newGameHandler = this.newGameHandler.bind(this);
  }

  newGameHandler(): void {
    this.setState((prevState) => {
      return { gameId: prevState.gameId + 1 }
    });
  }

  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Game
          key={this.state.gameId}  // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state
          newGameHandler={this.newGameHandler}
        />
      </MuiThemeProvider>
    );
  }
}

export default App;
