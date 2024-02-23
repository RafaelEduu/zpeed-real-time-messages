export interface SessionData {
  user: SessionUserData;
  expires: string;
}

export interface TokenData {
  email?: string;
  sub: string;
  name?: string;
  picture?: string;
}

export interface SessionUserData {
  email: string;
  name: string;
  image: string;
}

export interface UserData {
  userData: userDataProps;
}

interface userDataProps {
  login: string;
  id: string;
  gitHubId: string;
  name: string;
  imageUrl: string;
  avatarUrl: string;
}
