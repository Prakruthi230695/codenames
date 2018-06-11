// import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { PaletteColor, PaletteColorOptions } from '@material-ui/core/styles/createPalette';


declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    teamPalette: {
      red: PaletteColor;
      blue: PaletteColor;
    }
  }

  interface ThemeOptions {
    teamPalette?: {
      red?: PaletteColorOptions;
      blue?: PaletteColorOptions;
    }
  }
}
