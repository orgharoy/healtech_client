import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css'

import WithSidebar from './layouts/WithSidebar'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx';

import CreatePatientRecord from './pages/Patient/CreatePatientRecord.jsx';
import BillList from './pages/Patient/BillList.jsx';
import ReportDisbursement from './pages/Patient/ReportDisbursement.jsx';

import CreateReport from './pages/Reports/CreateReport.jsx';
import ReportChecker from './pages/Reports/ReportChecker.jsx';
import ViewReports from './pages/Reports/ViewReports.jsx';

import UserConfiguration from './pages/SecurityModule/UserConfiguration.jsx';
import SystemConfiguration from './pages/SecurityModule/SystemConfiguration.jsx';

import ReportViewer from './pages/ReportViewer/ReportViewer.jsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={ <Login />} />
        <Route path="/report/view" element = {<ReportViewer />} />

        <Route element={<WithSidebar />}>
          <Route path="/patient/new" element = {<CreatePatientRecord />} />
          <Route path="/patient/report/disbursement" element = {<ReportDisbursement />} />
          <Route path="/patient/bills" element = {<BillList />} />

          <Route path="/report/create" element = {<CreateReport />} />
          <Route path="/report/checker" element = {<ReportChecker />} />
          <Route path="/report/all" element = {<ViewReports />} />

          <Route path="/security/user-configuration" element = {<UserConfiguration />} />
          <Route path="/security/system-configuration" element = {<SystemConfiguration />} />

          <Route path="/" element = {<Home />} />
        </Route>
        
      </Routes>
    </ BrowserRouter>
  )
}

export default App
