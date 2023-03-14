import {useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Alert, FlatList } from 'react-native';
import { Header } from '@components/Header';
import { Highlight } from '@components/HighLight';
import { GroupCard } from '@components/GroupCard';

import {Container} from './styles'
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { groupsGetAll } from '@storage/group/groupsGetAll';
import { Loading } from '@components/Loading';
import socketio from '../../socketio';



export  function Groups() {
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  function handleNewGroup(){
    navigation.navigate('new');
  }

  async function fetchGroups(){
    try {
      setIsLoading(true);

      const data = await groupsGetAll();

      setGroups(data);
    } catch (error) {
      Alert.alert('Turmas', 'não foi possível carregar as turmas');
    }finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string){
    navigation.navigate('players', {group});
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, []));

  useEffect(() => {
    console.log('olá');
    socketio.on("hello", function (msg) {
      console.log('executei');
      console.log(msg);
    });    


  }, [socketio]);
  
  return (
    <Container>
      <Header/>
      <Highlight 
        title="Turmas" 
        subtitle='Jogue com a sua turma'
      />
      { isLoading ? <Loading/> :
        <FlatList
          data={groups}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <GroupCard 
              title={item}
              onPress={() => handleOpenGroup(item)}
            />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1}}
          ListEmptyComponent={() => (
            <ListEmpty 
              message="Que tal cadastrar uma turma?"
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      }
      <Button 
        title='Criar nova turma'
        onPress={handleNewGroup}
      />
    </Container>
  );
}
