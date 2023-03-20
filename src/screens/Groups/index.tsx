import { useState } from 'react';
import { FlatList } from 'react-native';

import { GroupCard } from '@components/GroupCard';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import * as S from './styles';
import { ListEmpty } from '@components/ListEmpty';

export function Groups() {
  const [groups, setGroups] = useState(['Galera da Rocketseat', 'Trapaceiros'])

  return (
    <S.Container>
      <Header />
      <Highlight title='Turmas' subtitle='Jogue com sua turma' />

      <FlatList 
        style={{ paddingBottom: 40, width: '100%' }}
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item })=> (
          <GroupCard 
            title={item} 
          />
        )}
        contentContainerStyle={groups.length === 0 && {flex: 1}}
        ListEmptyComponent={()=> (
          <ListEmpty
            message='Que tal cadastrar a primeira turma?' 
          />
        )}
      />
    </S.Container>
  );
}