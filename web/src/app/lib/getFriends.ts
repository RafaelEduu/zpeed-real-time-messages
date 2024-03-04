import { api } from "@/app/lib/api";
import getUser from "@/app/teste/useUser";
const createFriend = async (id: FormDataEntryValue | null) => {
  const user = await getUser();

  try {
    const friends = await api.post("/friends", {
      userOne: user.id,
      userTwo: id,
    });
    
  } catch (error) {
    console.log(error);
  }
};

export default createFriend;
