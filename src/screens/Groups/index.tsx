import { useState } from 'react';
import { FlatList } from 'react-native';

import { GroupCard } from '@components/GroupCard';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import * as S from './styles';

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
      />
    </S.Container>
  );
}