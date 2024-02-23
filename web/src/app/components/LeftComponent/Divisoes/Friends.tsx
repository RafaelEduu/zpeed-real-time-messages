import { api } from "@/app/lib/api";
import Usuario from "./Usuarios";

interface Friends {
  name: string;
}

export default async function Friends(props: any) {
  const user = props.friends

  const {data: friends} = await api.get(`friends/${user?.id}`);

  return (
    <div>
      <div>
        <Usuario friends={friends}/>
      </div>
    </div>
  );
}
