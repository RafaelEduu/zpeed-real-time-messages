"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateTime } from "next-auth/providers/kakao";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import createMessage from "../lib/createMessage";
import socket from "../lib/websocket";
import Message from "./authprovider/teste/teste";

interface friendData {
  friendId: string;
}

interface friendsProps {
  friendsId: string;
  content: string;
  userId: string;
  createdAt: DateTime;
}

interface MessageFormProps {
  friendId: friendData; // Assuming friendId is of type string
  userId: string; // Assuming userId is of type string
}

const MessageForm: React.FC<MessageFormProps> = ({ friendId, userId }) => {

  const [data, setData] = useState("");

  useEffect(() => {
    const handleReceiveMessage = (data: any) => {
      const newMessage: friendsProps = data;
      setData((prevMessages): any => [...prevMessages, newMessage]);
      console.log(data);
    };
  
    // Adicione o ouvinte de evento no montante do componente
    socket.on("msg-recieve", handleReceiveMessage);
  
    // Remova o ouvinte de evento no desmontante do componente
    return () => {
      socket.off("msg-recieve", handleReceiveMessage);
    };
  }, []);
  

  const formSchema = z.object({
    message: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMessage(friendId, values.message);

    values.message = "";
  }

  return (
    <div className="h-full flex flex-col justify-between w-full ">
      <ScrollArea className="h-[535px] w-full whitespace-nowrap">
        <div className="flex flex-col">
          {<Message data={data} friendId={friendId} />}
        </div>
      </ScrollArea>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-row gap-3 w-full p-2 bg-indigo-400 h-16 items-center"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Digite alguma mensagem" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-indigo-600">
            Enviar
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MessageForm;
