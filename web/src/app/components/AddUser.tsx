'use client'

import { FormEvent } from "react";
import createFriend from "../lib/getFriends";

const AddUser = () => {

  function searchFriend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData =  new FormData(event.currentTarget)
    const id = formData.get('content')

    createFriend(id)
  }

  return (
    <div>
      <p>Oi</p>
      <form onSubmit={searchFriend} className="flex flex-col items-center">
        <textarea
          name="content"
          className="w-[500px] bg-zinc-400 min-h-[100px] flex-1 resize-none rounded border-[1px] border-zinc-300 p-0 text-lg leading-relaxed text-gray-200 placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="bg-slate-200 w-20 text-gray-800 rounded-lg align-middle"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default AddUser;
