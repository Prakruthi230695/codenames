import * as React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';


interface Props {
  winner: '' | 'red' | 'blue',
  newGameHandler(e: React.MouseEvent<HTMLButtonElement>): void
}

interface State {
  dialogOpen: boolean
}

class NewGameWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      dialogOpen: false
    }

    this.checkGameStatus = this.checkGameStatus.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.confirmHandler = this.confirmHandler.bind(this);
  }

  checkGameStatus(e: React.MouseEvent<HTMLButtonElement>): void {
    if (!!this.props.winner) {
      this.props.newGameHandler(e);
    } else {
      this.setState({ dialogOpen: true });
    }
  }

  closeHandler(): void {
    this.setState({ dialogOpen: false });
  }

  confirmHandler(e: React.MouseEvent<HTMLButtonElement>): void {
    this.closeHandler();
    this.props.newGameHandler(e);
  }

  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.closeHandler}
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {"Make a new game?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeHandler}>
              {"Cancel"}
            </Button>
            <Button onClick={this.confirmHandler}>
              {"Confirm"}
            </Button>
          </DialogActions>
        </Dialog>

        <Button
          onClick={this.checkGameStatus}
          variant={"contained"}
          color={"primary"}
        >
          {"New Game"}
        </Button>
      </React.Fragment>
    )
  }
}

export default(NewGameWidget);
