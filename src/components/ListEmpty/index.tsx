import {Container, Message} from './style';
import { Text } from 'react-native-svg';

type Props = {
  message: string,
}

export function ListEmpty({message}: Props){
  return(
    <Container>
      <Message>
        {message}
      </Message>
    </Container>
  );
}