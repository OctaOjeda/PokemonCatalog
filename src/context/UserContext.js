import { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) setUserInfo(JSON.parse(stored));
  }, []);

//   useEffect(() => {
//     if (userInfo)
//         localStorage.setItem("userInfo", JSON.stringify(userInfo));
//   }, userInfo)

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);