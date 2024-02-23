import { api } from "../lib/api"
import getUser from "../teste/useUser"

const HandleFriendId = async (friendId: string) => {
  const { id: currentUser} = await getUser()
  const { data } = await api.get(`/getfriendsId/userOne/${currentUser}/userTwo/${friendId}`)

  return data
}

export default HandleFriendId 