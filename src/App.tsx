import * as React from 'react';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import CssBaseline from '@material-ui/core/CssBaseline';

import TurnIndicator from './TurnIndicator/TurnIndicator';

import './App.css';
import logo from './logo.svg';


const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: blue
  }
});

class App extends React.Component {
  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.tsx</code> and save to reload.
          </p>
        <TurnIndicator turn={'red'} winner={''} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
