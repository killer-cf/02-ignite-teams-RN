import AsyncStorage from "@react-native-async-storage/async-storage"
import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/storageConfig"
import { groupsGetAll } from "./goupsGetAll"

export async function groupRemoveByName(groupName: string) {
  try {
    const storedGroups = await groupsGetAll()
    const groups = JSON.stringify(storedGroups.filter(group => group !== groupName))

    await AsyncStorage.setItem(GROUP_COLLECTION, groups)
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupName}`)

  } catch (error) {
    throw error
  }
}