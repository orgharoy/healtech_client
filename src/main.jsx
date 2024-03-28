import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { NotificationProvider } from './context/notificationContext.jsx';

import { ConfigProvider } from 'antd';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotificationProvider>
      <ConfigProvider
          theme={{ token: {
                "colorPrimary": "#6546de",
                "colorInfo": "#6546de"
              },
          }}
      >
        <App />
      </ConfigProvider>
    </NotificationProvider>
    
  </React.StrictMode>,
)
