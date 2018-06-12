import * as React from 'react';

import Button from '@material-ui/core/Button';


interface Props {
  endTurnHandler(e: React.MouseEvent<HTMLButtonElement>): void
}

const EndTurnButton: React.SFC<Props> = (props: Props) => {
  const { endTurnHandler } = props;

  return (
    <Button
      onClick={endTurnHandler}
    >
      {'End Turn'}
    </Button>
  )
}

export default EndTurnButton;
