import React from 'react'
import PageTitle from '../../components/PageTitle'
import { Tabs } from 'antd';

import CreateUser from '../../components/SecUserConfig/CreateUser.jsx'
import NewUserChecker from '../../components/SecUserConfig/NewUserChecker';
import UserList from '../../components/SecUserConfig/UserList.jsx';

const UserConfiguration = () => {
  const tabItems = [
    {
      key: '1',
      label: 'New User',
      children: <CreateUser />,
    },
    {
      key: '2',
      label: 'User Checker',
      children: <NewUserChecker />,
    },
    {
      key: '3',
      label: 'User List',
      children: <UserList />,
    },
  ];

  return (
    <main>
      <PageTitle pageHeader={"User Configuration"} />

      <Tabs defaultActiveKey='3' tabPosition="left">
        {tabItems.map((tab) => (
          <Tabs.TabPane tab={tab.label} key={tab.key} disabled={tab.disabled}>
            {tab.children}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </main>
  );
};


export default UserConfiguration