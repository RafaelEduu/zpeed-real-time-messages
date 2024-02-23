import getUser from "../teste/useUser";
import { api } from "./api";

interface FriendProps {
  friendId: string;
}

const createMessage = async (
  friendId: FriendProps,
  content: FormDataEntryValue | null
) => {
  const user = await getUser();
  const friendsId = friendId;
  const userId = user.id;
  
  try {
    await api.post("/message", {
      content,
      friendsId,
      userId,
    });

  } catch (error) {
    console.log(error);
  }
};

export default createMessage;
