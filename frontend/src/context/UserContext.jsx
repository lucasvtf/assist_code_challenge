import { createContext, useEffect, useState } from 'react';
import { checkUser } from '../utils/api';

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await checkUser();
      console.log(userData)
      setId(userData.id)
      setLoggedInUsername(userData.username)
    }
    fetchUser();
  }, [])

  return (
    <UserContext.Provider
      value={{ loggedInUsername, id, setLoggedInUsername, setId }}
    >
      {children}
    </UserContext.Provider>
  );
}

