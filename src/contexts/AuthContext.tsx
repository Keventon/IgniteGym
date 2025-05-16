import { UserDTO } from "@dtos/userDTO";
import { createContext, useState } from "react";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => void;
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({
    id: "1",
    name: "Keventon",
    email: "keventon@gmail.com",
    avatar: "keventon.png",
  });

  function signIn(email: string, password: string) {
    setUser({ id: "1", name: "Keventon", email, avatar: "keventon.png" });
  }

  return (
    <AuthContext.Provider value={{ user, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
