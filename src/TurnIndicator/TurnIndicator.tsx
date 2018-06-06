import * as React from 'react';
import Typography from '@material-ui/core/Typography';


type Props = {
  turn: 'red' | 'blue',
  winner: '' | 'red' | 'blue',
}

const TurnIndicator: React.SFC<Props> = (props) => {
  const { turn, winner }: { turn: string, winner: string } = props;
  let text: string;

  if (winner) {
    text = winner === 'red' ? 'RED WINS!' : 'BLUE WINS!';
  } else {
    text = turn === 'red' ? 'RED\'S TURN' : 'BLUE\'S TURN';
  };

  return (
    <Typography
      variant={winner ? 'display2' : 'display1'}
      gutterBottom
    >
      {text}
    </Typography>
  )
}

export default TurnIndicator;
