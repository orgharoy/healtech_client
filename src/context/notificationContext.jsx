import React, { createContext, useMemo } from 'react';
import { notification } from 'antd';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message, description) => {
    //types: 'success', 'info', 'warning', 'error'
    api[type.toLowerCase()]({
      message: message,
      description: description,
      placement: 'topRight',
    });
  };

  const contextValue = useMemo(() => ({ openNotification }), [api]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;