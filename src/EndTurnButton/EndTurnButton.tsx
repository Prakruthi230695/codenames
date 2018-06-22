import * as React from 'react';

import Button from '@material-ui/core/Button';


interface Props {
  winner: "" | "red" | "blue",
  endTurnHandler(e: React.MouseEvent<HTMLButtonElement>): void
}

const EndTurnButton: React.SFC<Props> = (props: Props) => {
  const { endTurnHandler, winner } = props;

  return (
    <Button
      onClick={endTurnHandler}
      disabled={!!winner}
    >
      {'End Turn'}
    </Button>
  )
}

export default EndTurnButton;
