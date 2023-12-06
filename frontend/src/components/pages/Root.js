import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { UsersContextProvider } from '../store/users-context';
import { WebSocketContextProvider } from '../store/websocket-context';
import Layout from '../layouts/Layout';
import { FollowingContextProvider } from '../store/following-context';
import { GroupsContextProvider } from '../store/groups-context';
import { JoinedGroupContextProvider } from '../store/joined-group-context';

const Root = () => {
  return (
    <>
      <UsersContextProvider>
        <WebSocketContextProvider>
          <FollowingContextProvider>
            <GroupsContextProvider>
              <JoinedGroupContextProvider>
                <Layout>
                  <Outlet />
                </Layout>
              </JoinedGroupContextProvider>
            </GroupsContextProvider>
          </FollowingContextProvider>
        </WebSocketContextProvider>
      </UsersContextProvider>
    </>
  );
};

export default Root;
