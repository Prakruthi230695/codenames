import * as React from 'react';

import Button from '@material-ui/core/Button';

import { Winner } from '../Game/Game';

interface Props {
  winner: Winner,
  endTurnHandler(e: React.MouseEvent<HTMLButtonElement>): void
}

const EndTurnButton: React.SFC<Props> = (props: Props) => {
  const { endTurnHandler, winner } = props;

  return (
    <Button
      onClick={endTurnHandler}
      disabled={!!winner}
      variant={"contained"}
      color={"secondary"}
    >
      {'End Turn'}
    </Button>
  )
}

export default EndTurnButton;
