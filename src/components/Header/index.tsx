import { useNavigation } from '@react-navigation/native';

import {Container, Logo, BackButton, BackIcon} from './style';
import logoImg from '@assets/logo.png'

type Props = {
  showBackButton?: boolean;
}

export function Header({showBackButton = false}: Props) {
  const navigation = useNavigation();

  function handleGoback(){
    navigation.navigate('groups');
  }

  return(
    <Container>
      {
        showBackButton && 
        <BackButton onPress={handleGoback}>
          <BackIcon/>
        </BackButton>
      }
      <Logo source={logoImg}/>
    </Container>
  )
}