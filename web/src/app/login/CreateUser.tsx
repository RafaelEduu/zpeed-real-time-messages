/* import { getSession } from "next-auth/react";
import useSessionTyped from "../components/Sessiontypes";
import { api } from "../lib/api";

export default async function CreateUser() {
  const session = await getSession();

  const data = await useSessionTyped(session);

  const informations = data?.token

  try {
    await api.post("/register", {
      gitHubId: informations?.sub,
      name: informations?.name,
      login: informations?.email,
      avatarUrl: informations?.picture, 
    });
  } catch (error) {
   console.log(error);
    throw new Error("Não foi possível registrar o usuário");
  }
}
 */