"use server";

import { SessionData } from "@/types/types";
import { getServerSession } from "next-auth";

import { api } from "../lib/api";
import { signJwtAccessToken } from "../lib/jwt";

const getUser = async () => {
  const session = await getServerSession();

  try {
    const data: SessionData = session;
    const login = data.user.email;
    const currentUserResponse = await api.get(`/user/${login}`);
    const user = currentUserResponse.data.user;

    const accessToken = signJwtAccessToken(user);

    const result = {
      ...user,
      accessToken,
    };

    return result;
  } catch (error) {
    console.log(error)
  }
};

export default getUser;
