import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';

const WithSidebar = () => {
  return (

    <main className="relative w-screen min-h-screen bg-slate-200">
      <div className="fixed top-0 left-0 w-[250px] h-screen shadow-md bg-white">
        <Sidebar />
      </div>
      <div className="fixed top-0 left-[250px] h-screen w-[calc(100vw-250px)] overflow-y-scroll overflow-x-hidden">
        <div className="sticky top-0 h-[60px] gb-white shadow-[0_1px_6px_0_rgba(0,0,0,0.05)] z-50">
          <Topbar />
        </div>
        <div className="m-5 p-5 rounded-lg bg-white min-h-[calc(100%-100px)]">
          <Outlet />
        </div>
      </div>

    </main>

  );
};

export default WithSidebar;