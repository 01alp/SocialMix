import React, { useState, useEffect } from 'react';

export const UsersContext = React.createContext({
  users: [],
  onNewUserReg: () => {},
  // onlineUsers: [],
});

export const UsersContextProvider = (props) => {
  const [usersList, setUsersList] = useState([]);

  // get users
  const getUsersHandler = () => {
    const userUrl = 'http://localhost:8080/user';
    fetch(userUrl)
      .then((resp) => resp.json())
      .then((data) => {
        // console.log('user (context): ', data);
        let [usersArr] = Object.values(data);
        usersArr.sort((a, b) => a.id - b.id);
        setUsersList(usersArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(getUsersHandler, []);
  // useEffect(getInitialUserPrivacy, []);

  return (
    <UsersContext.Provider
      value={{
        users: usersList,
        onNewUserReg: getUsersHandler,
        // onlineUsers: onlineUsersList,
      }}
    >
      {props.children}
    </UsersContext.Provider>
  );
};
