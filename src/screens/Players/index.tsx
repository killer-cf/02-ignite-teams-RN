import { useState, useEffect, useRef } from "react";
import { Alert, FlatList, Keyboard, TextInput } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { Loading } from "@components/Loading";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

type RouteParms = {
  group: string
}

export function Players() {
  const [isLoading, setIsloading] = useState(true)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [team, setTeam] = useState('time a')
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
  const newPlayerNameInput = useRef<TextInput>(null)

  const route = useRoute()
  const { group } = route.params as RouteParms

  const natigation = useNavigation()

  async function handleAddPlayer() {
    if(newPlayerName.trim().length === 0) {
      return Alert.alert('Novo Jogador', 'Informe o nome do jopgador para adicionar')
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group)
      fetchPlayersByTeam()
      setNewPlayerName('')
      newPlayerNameInput.current?.blur()
      Keyboard.dismiss()

    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Novo jogador', error.message)
      } else {
        console.log(error)
        Alert.alert('Novo jogador', 'Não foi possivel adicionar o o jogador')
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsloading(true)
      
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam)

    } catch (error) {
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.');
    } finally {
      setIsloading(false)
    }
  }

  async function handleRemovePlayer(playerName: string){
    try {
      await playerRemoveByGroup(playerName, group)
      fetchPlayersByTeam()

    } catch (error) {
      console.log(error);
      Alert.alert('Remover jogador', 'Não foi possível remover o jogador selecionado')
    }
  }

  async function groupRemove(){
    try {
      await groupRemoveByName(group)
      natigation.navigate('groups')

    } catch (error) {
      console.log(error);
      Alert.alert('Remover grupo', 'Não foi possível remover o turma')
    }
  }

  async function handleRemoveGroup() {
    Alert.alert('Remover turma', 'Deseja remover a turma?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => groupRemove()}
      ]
    )
  }

  useEffect(()=> {
    fetchPlayersByTeam()
  }, [team])

  return (
    <Container>
      <Header showBackButton />

      <Highlight 
        title={group}
        subtitle="adicione a galera e separe os times"
      />

      <Form>
        <Input
          inputRef={newPlayerNameInput}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon icon="add" onPress={handleAddPlayer}/>
      </Form>

      <HeaderList>
        <FlatList
        data={['time a', 'time b']}
        keyExtractor={item => item}
        renderItem={({item})=> (
          <Filter 
            title={item}
            isActive={ item === team }
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
        isLoading ? <Loading /> :
         
      <FlatList 
        data={players}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <PlayerCard 
            name={item.name} 
            onRemove={() => handleRemovePlayer(item.name)}
          />
        )}
        ListEmptyComponent={() => (
          <ListEmpty message="Não há pessoas nesse time" />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
      /> 
      }

      <Button 
        title="Remover Turma"
        type="SECONDARY"
        onPress={handleRemoveGroup}
      />
    </Container>
  )
}