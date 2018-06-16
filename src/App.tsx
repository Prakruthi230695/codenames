import * as React from 'react';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import CssBaseline from '@material-ui/core/CssBaseline';


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
      </MuiThemeProvider>
    );
  }
}

export default App;
