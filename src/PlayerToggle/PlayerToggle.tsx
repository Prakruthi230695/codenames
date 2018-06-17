import * as React from 'react';

import { createStyles, withStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { WithStyles } from '@material-ui/core';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = (theme: Theme) => createStyles({
});

// Since I'm just toggling, don't need player type to be passed.
interface Props extends WithStyles<typeof styles> {
  togglePlayerType(e: React.FormEvent<HTMLInputElement>): void
}

// This is dumb. If I don't use a boolean in Game, I might declare it there
// and import it here.
type PlayerTypes = "player" | "spymaster"

interface State {
  value: PlayerTypes
}

class PlayerToggle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: "player"
    }

    this.handleChange = this.handleChange.bind(this);
  }

  // Can I just use the value parameter? I'm confused. https://material-ui.com/api/radio-group/
  handleChange(e: React.FormEvent<HTMLInputElement>): void {
    this.setState({ value: e.currentTarget.value as PlayerTypes });
    this.props.togglePlayerType(e);
  }

  render() {
    return (
      <FormControl component="fieldset" >
        <FormLabel component="legend">Player Type</FormLabel>
        <RadioGroup
          aria-label="Player Type"
          name="player-type"
          value={this.state.value}
          onChange={this.handleChange}
        >
          <FormControlLabel
            value="player"
            control={<Radio />}
            label="Player"
          />
          <FormControlLabel
            value="spymaster"
            control={<Radio />}
            label="Spymaster"
          />
        </RadioGroup>
      </FormControl>
    )
  }
}

export default withStyles(styles)(PlayerToggle);
