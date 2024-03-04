/* import MessageForm from "@/app/components/CreateMessageForm";
import getUser from "@/app/teste/useUser";

interface Amizades {
  content: string;
  userId: string;
  createdAt: string;
}

export default async function Teste({ params }: any) {
  const { id } = await getUser();

  return (
    <div className="h-full">
      <MessageForm friendId={params.id} userId={id} />
    </div>
  );
}
 */
"use client";

import MessageForm from "@/app/components/CreateMessageForm";
import { useEffect, useState } from "react";

export default function Teste({ params }: any) {
  const [domLoaded, setDomLoaded] = useState(false);
  const [user, setUser] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  /*   const data = async () => {
    const { id } = await getUser();
    setUser(id);

    data()
  }; */

  return (
    <>
      <div className="h-full">
        <MessageForm friendId={params.id} /*  userId={id} */ />
      </div>
    </>
  );
}
