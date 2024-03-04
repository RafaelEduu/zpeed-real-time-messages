import getUser from "@/app/teste/useUser";
import { api } from "./api";
import socket from "./websocket";

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
  const receiver = await api.get(
    `receiverUserId/${userId}/friend/${friendsId}`
  );
  const receiverId = receiver.data.receiverId[0].id;

  try {
    socket.emit("send-msg", {
      content,
      friendsId,
      userId,
      receiverId,
    });
  } catch (error) {
    console.log(error);
  }
};

export default createMessage;
