import { useState, useEffect, useRef } from "react";
import { Alert, FlatList, TextInput, Keyboard} from 'react-native';
import { Container, Form, HeaderList, NumberOfPlayers } from "./style";
import { Header } from '@components/Header/index';
import { Highlight } from '@components/HighLight';
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input/Index";
import { Filter } from '@components/Filter/index';
import { PlayCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppError } from '@utils/AppError';
import { playerAddByGroup } from "@storage/players/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/players/playersGetByGrouAndTeam";
import { PlayerStorageDTO } from '../../storage/players/PlayerStorageDTO';
import { playerRemoveByGroup } from "@storage/players/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from '../../components/Loading/index';

type RouteParams = {
  group: string,
}

export function Players(){
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const newPlayerNameInputRef = useRef<TextInput>(null);

  const navigator = useNavigation();
  const route = useRoute();
  const { group } = route.params as RouteParams;


  async function handleAddPlayer(){
    if(newPlayerName.trim().length === 0){
      return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar!');
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.blur();
      Keyboard.dismiss();

      setNewPlayerName('');

      fecthPlayersByTeam();
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert('Nova pessoas', error.message);
      }else{
        Alert.alert('Nova pessoa', 'Não foi possível adicionar');
      }
    }
  }

  async function fecthPlayersByTeam(){
    try {
      setIsLoading(true);
    
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);    
    } catch (error) {
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas filtradas do time.')
    }finally{
      setIsLoading(false);      
    }
  }

  async function handlePlayerRemove(playerName: string){
    try {
      await playerRemoveByGroup(playerName, group);      
    
      fecthPlayersByTeam();

    } catch (error) {
      Alert.alert('Remover pessoas', 'Não foi possível remover esta pessoa.')
    }
  }

  async function groupRemove(){
    try {
      await groupRemoveByName(group);
      navigator.navigate('groups');
    } catch (error) {
      Alert.alert('Remover pessoas', 'Não foi possível remover este grupo');      
    }
  }

  async function handleGroupRemove(){
    Alert.alert(
      'Remover grupo',
      'Deseja remover o grupo?',
      [
        {text: 'Não', style: 'cancel'},
        {text: 'Sim', onPress: async () => groupRemove() }
      ]
    );
  }

  useEffect(() => {
    fecthPlayersByTeam();
  }, [team])

  return(
    <Container>
      <Header
        showBackButton
      />
      <Highlight
        title={group}
        subtitle="Adicione a galera e separe os times"
      />
      <Form>
        <Input
          inputRef={newPlayerNameInputRef} 
          placeholder="Nome da pessoa"
          autoCorrect={false}
          value={newPlayerName}
          onChangeText={(text) => setNewPlayerName(text)}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />

        <ButtonIcon 
          icon="add" 
          type="PRIMARY"
          onPress={handleAddPlayer}
        />
      </Form>
      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <Filter
            title={item} isActive={item === team}
            onPress={() => setTeam(item)}
          />
          )}
          horizontal
        />
        <NumberOfPlayers>
          {players.length}
        </NumberOfPlayers>
      </HeaderList>
      {
        isLoading ? <Loading/> : 
        <FlatList
          data={players}
          keyExtractor={item => item.name}
          renderItem={({item}) => (
            <PlayCard 
              name={item.name} 
              onRemove={() => {handlePlayerRemove(item.name)}}  
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty 
              message="Não há pessoas neste time"
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            {paddingBottom: 100},
            players.length === 0 && {flex: 1}
          ]}
        />
      }
      <Button
        title="Remover Turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  )
}