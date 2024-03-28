import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { UserAddOutlined, TeamOutlined } from '@ant-design/icons'

const style = {
  linkStyle: "text-[#545f66] flex items-center gap-[0.5rem] rounded-md font-normal py-[0.35rem] px-2 sidebarMenu transition-all mb-[0.3rem]",
  headingStyle: "text-sm font-semibold text-slate-400 pb-2 mx-4"
}

const Sidebar = () => {
  const [menuLocation, setMenuLocation] = useState('');

  const location = useLocation();

  useEffect(()=> {
    setMenuLocation(location)
    console.log(menuLocation.pathname);
  }, [location])

  return (
    <div className="mx-3 ">
      <div className="h-[60px] flex items-center mx-2">
        <Link to="/" className="font-bold text-2xl hover:text-blue-600 text-slate-700 transition-all ">
          HillTrack
        </Link>
      </div>

      <div className="mt-5">
        <div> {/* patient management div */}
          <p className={style.headingStyle}>Patient Management</p>     
              
            <Link to="/patient/new" className={`${style.linkStyle} ${menuLocation.pathname === "/patient/new" && "sideBarMenuSelected"}`}>
              <UserAddOutlined />
              Patient Enrollment
            </Link>

            <Link to="/patient/report/disbursement" className={`${style.linkStyle} ${menuLocation.pathname === "/patient/report/disbursement" && "sideBarMenuSelected"}`}>
              <UserAddOutlined />
              Report Disbursement
            </Link>

            <Link to="/patient/bills" className={`${style.linkStyle} ${menuLocation.pathname === "/patient/bills" && "sideBarMenuSelected"}`}>
              <UserAddOutlined />
              Bill List
            </Link>

        </div>
      </div>

      <div className="mt-5">
        <div> {/* report management div */}
          <p className={style.headingStyle}>Report Management</p>     
              
            <Link to="/report/create" className={`${style.linkStyle} ${menuLocation.pathname === "/report/create" && "sideBarMenuSelected"}`}>
              <UserAddOutlined />
              Create Report
            </Link>

            <Link to="/report/checker" className={`${style.linkStyle} ${menuLocation.pathname === "/report/checker" && "sideBarMenuSelected"}`}>
              <TeamOutlined />
              Report Checker
            </Link>

            <Link to="/report/all" className={`${style.linkStyle} ${menuLocation.pathname === "/report/all" && "sideBarMenuSelected"}`}>
              <TeamOutlined />
              View Reports
            </Link>

        </div>
      </div>

      <div className="mt-5">
        <div> {/* user management div */}
          <p className={style.headingStyle}>Security Module</p>     
              
            <Link to="/security/user-configuration" className={`${style.linkStyle} ${menuLocation.pathname === "/security/user-configuration" && "sideBarMenuSelected"}`}>
              <UserAddOutlined />
              User Configuration
            </Link>

            <Link to="/security/system-configuration" className={`${style.linkStyle} ${menuLocation.pathname === "/security/system-configuration" && "sideBarMenuSelected"}`}>
              <TeamOutlined />
              System Configuration
            </Link>
        </div>
      </div>



    </div>
  )
}

export default Sidebar