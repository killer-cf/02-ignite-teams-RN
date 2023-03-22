import { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { GroupCard } from '@components/GroupCard';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import * as S from './styles';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { groupsGetAll } from '@storage/group/goupsGetAll';
import { Loading } from '@components/Loading';

export function Groups() {
  const [isLoading, setIsloading] = useState(true)
  const [groups, setGroups] = useState([''])

  const navigation = useNavigation()

  function handleNewGroup() {
    navigation.navigate('new')
  }

  async function fetchGroups() {
    try {
      setIsloading(true)

      const storedGroups = await groupsGetAll()
      setGroups(storedGroups)

    } catch (error) {
      console.log(error)
    } finally {
      setIsloading(false)
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group})
  }

  useFocusEffect(useCallback(()=> {
    fetchGroups()
  }, []))

  return (
    <S.Container>
      <Header />
      <Highlight title='Turmas' subtitle='Jogue com sua turma' />

      {
        isLoading ? <Loading /> :
          <FlatList 
          style={{ paddingBottom: 40, width: '100%' }}
          data={groups}
          keyExtractor={item => item}
          renderItem={({ item })=> (
            <GroupCard 
            title={item}
            onPress={()=> handleOpenGroup(item)}
            />
            )}
            contentContainerStyle={groups.length === 0 && {flex: 1}}
            ListEmptyComponent={()=> (
              <ListEmpty
              message='Que tal cadastrar a primeira turma?' 
              />
            )}
          />
        }

      <Button title='Criar nova turma' onPress={handleNewGroup} />
    </S.Container>
  );
}