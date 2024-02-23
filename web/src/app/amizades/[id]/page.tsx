import MessageForm from "@/app/components/CreateMessageForm";
import getUser from "@/app/teste/useUser";

interface Amizades {
  content: string;
  userId: string;
  createdAt: string;
}

export default async function Teste({ params }: any) {
  const { id } = await getUser()

  return (
    <div className="h-full">
      <MessageForm friendId={params.id} userId={id} />
    </div>
  );
}
