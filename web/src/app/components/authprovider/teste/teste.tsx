import dataFriends from "@/app/lib/fetchDataFriends";
import getUser from "@/app/teste/useUser";
import { UUID } from "crypto";
import { DateTime } from "next-auth/providers/kakao";
import { useEffect, useState } from "react";

interface dataMessage {
  createdAt: DateTime;
  content: string;
  userId: string;
  friendsId: string;
}

interface dataFromFriend {
  content: string;
  userId: string;
  createdAt: DateTime;
}

interface userData {
  id: UUID;
  gitHubId: string;
  name: string;
  login: string;
  avatarUrl: string;
}

export default function Message({ data, friendId }: any) {
  const [userData, setUserData] = useState<userData>();
  const [friendData, setfriendData] = useState<dataFromFriend[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { message } = await dataFriends(friendId);

      setfriendData(message);
    };

    fetchData();
  }, [friendId]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();
      setUserData(user);
    };

    fetchData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { id } = userData;

  return (
    <div> 
      <div className="w-full p-10">
        {friendData &&
          friendData.map((messages: any) => (
            <div
              key={messages.id}
              className={`flex break-all flex-wrap p-2 ${
                id === messages.userId ? "justify-end" : "justify-start"
              }`}
            >
              {messages.content && (
                <div
                  className={`space-y-1 max-w-[400px] h-auto p-1 rounded-lg  ${
                    id === messages.userId
                      ? "bg-indigo-500"
                      : "bg-slate-200 text-gray-600"
                  }`}
                >
                  <span className="text-wrap break-normal line-clamp-5 hover:line-clamp-none">
                    {messages.content}
                  </span>
                  <div>
                    <span className="flex justify-end">{messages.createdAt}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      <div  className="p-10">
        {data &&
          data.map((message: dataMessage) => (
            <div
            key={data.id}
            className={`flex break-all flex-wrap p-2 ${
              id === message.userId ? "justify-end" : "justify-start"
            }`}
          >
             {message.content && (
                <div
                  className={`space-y-1 max-w-[400px] h-auto p-1 rounded-lg  ${
                    id === message.userId
                      ? "bg-indigo-500"
                      : "bg-slate-200 text-gray-600"
                  }`}
                >
                  <span className="text-wrap break-normal">
                    {message.content}
                  </span>
                  <div>
                    <span className="flex justify-end">{message.createdAt}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
