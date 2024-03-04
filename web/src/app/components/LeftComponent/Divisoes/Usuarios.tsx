"use client";
import HandleFriendId from "@/app/handler/handle-friend-id";
import socket from "@/app/lib/websocket";
import getUser from "@/app/teste/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Friends {
  avatarUrl: string;
  name: string;
  id: string;
  login: string;
  gitHubId: string;
}

export default function Usuario(props: any) {

  useEffect(() => {
    const teste = async () => {
      const user = await getUser();
      socket.emit("add-user", user?.id,  user?.accessToken );
    };

    teste();

    return () => {
      socket.off("add-user");
    };
  }, []);

  const friends = props.friends.friends;

  const router = useRouter();

  const getFriendId = async (friendId: string) => {
    const id = friendId;
    const { getFriendsId } = await HandleFriendId(id);

    router.push(`/amizades/${getFriendsId[0].id}`);
  };

  return (
    <div>
      <ScrollArea className="h-[535px] w-full whitespace-nowrap">
        <Table>
          <TableCaption>Sua lista de amigos</TableCaption>
          {friends.map((friend: any) => {
            return (
              <TableBody
                key={friend[0].id}
                onClick={() => getFriendId(friend[0].id)}
              >
                <TableRow>
                  <TableCell className="font-medium">
                    <Avatar>
                      <AvatarImage src={friend[0].avatarUrl} />
                      <AvatarFallback>...</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="text-lg text-zinc-300 pl-4">
                    {friend[0].name}
                  </TableCell>
                </TableRow>
              </TableBody>
            );
          })}
        </Table>
      </ScrollArea>
    </div>
  );
}
