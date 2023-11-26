import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { UsersContextProvider } from '../store/users-context';
import { WebSocketContextProvider } from '../store/websocket-context';
import Layout from '../layouts/Layout';

const Root = () => {
  return (
    <>
      <UsersContextProvider>
        <WebSocketContextProvider>
          <Layout>
            <Outlet />
          </Layout>
        </WebSocketContextProvider>
      </UsersContextProvider>
    </>
  );
};

export default Root;
