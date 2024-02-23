import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserData } from "@/types/types";

export default async function Informations(props: any) {
  const { userData: user }: UserData = props;

  return (
    <div>
      <div className=" pl-3">
        <Avatar>
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
