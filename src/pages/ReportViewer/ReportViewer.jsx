import React from 'react';
import Report from '../../components/PDFReports/Report.jsx'
import { PDFViewer } from '@react-pdf/renderer';

const ReportViewer = () => {
  return (
    <PDFViewer>
        <Report />
    </PDFViewer>
  )
}

export default ReportViewer