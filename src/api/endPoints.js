const API_URL = "http://localhost:6969/api";

const apiRoutes = {
  //validateUser: `${API_URL}/auth/isauthorized`,
  login: `${API_URL}/auth/login`,
  //changePassword: `${API_URL}/auth/changepassword`,

  createNewUser: `${API_URL}/user`,
  fetchActiveUsers : `${API_URL}/user`,
  fetchUserListForMaker: `${API_URL}/user/maker`,
  updateUserFromMaker: `${API_URL}/user/maker/edit/`,
  deleteUserFromMaker: `${API_URL}/user/maker/delete/`,
  fetchUserListForChecker: `${API_URL}/user/checker`,
  approveUser: `${API_URL}/user/checker/approve/`,
  rejectUser: `${API_URL}/user/checker/reject/`,
  editActiveUser: `${API_URL}/user/active/edit/`,

  createNewReport: `${API_URL}/report`,
  fetchReportListForMaker : `${API_URL}/report/maker`,
  updateReportFromMaker:  `${API_URL}/report/maker/edit/`,
  deleteReportFromMaker: `${API_URL}/report/maker/delete/`,
  fetchReportListForChecker : `${API_URL}/report/checker`,
  approveReport: `${API_URL}/report/checker/approve/`,
  rejectReport: `${API_URL}/report/checker/reject/`,
  fetchActiveUsers: `${API_URL}/report`,
  editActiveReport: `${API_URL}/report/active/edit/`,

  fetchActiveReportGroups: `${API_URL}/report-group`,

  postNewPatientRecord: `${API_URL}/new-patient-entry`,
  fetchPatientRecords: `${API_URL}/patient/fetch`,

  fetchBillDetails: `${API_URL}/bill/`,
  updateBillDetails: `${API_URL}/bill`,
  
  
//   createNewCustomer: `${API_URL}/customers/add`,
//   getClientList: `${API_URL}/business/clients`,
  
//   createBusinessRecord: `${API_URL}/business/add`,
//   getAllBusinessRecords: `${API_URL}/business/all`,
//   getFilteredBusinessRecords: `${API_URL}/business/filterbywopodate`,
//   getBusinessRecordById: `${API_URL}/business/record`,
//   deleteBusinessRecord: `${API_URL}/business/delete`,
//   updateBusinessRecord: `${API_URL}/business/update`,

};

export default apiRoutes;