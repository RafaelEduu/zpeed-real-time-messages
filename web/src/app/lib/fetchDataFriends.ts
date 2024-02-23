import { api } from "./api";

const dataFriends = async (id: string) => {
  try {
    const { data } = await api.get(`friendsMessages/${id}`);
    
    return data.friends;
  } catch (error) {
    console.log(error);
  }
};

export default dataFriends;
