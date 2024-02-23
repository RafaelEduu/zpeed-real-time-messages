/* import Friends from "./Divisoes/Friends"; */
import getUser from "@/app/teste/useUser";
import Friends from "./Divisoes/Friends";
import Informations from "./Divisoes/Informations";

export default async function LeftComponent() {
  const user = await getUser();

  return (
    <div className="bg-zinc-900 text-zinc-700 h-full flex flex-col">
      <div className="h-[10%] bg-indigo-400 w-full flex items-center">
        <Informations userData={user} />
      </div>
      <div className="h-[90%]">
        <Friends friends={user} />
      </div>
    </div>
  );
}
