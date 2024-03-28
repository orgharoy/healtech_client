import React, { useState, useEffect, useContext } from 'react'
import PageTitle from '../../components/PageTitle'
import axios from 'axios';
import apiRoutes from '../../api/endPoints';
import { Table, Tag, Button } from 'antd'
import NotificationContext from '../../context/notificationContext.jsx';

const ReportChecker = () => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedTableRows, setSelectedTableRows] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const { openNotification } = useContext(NotificationContext);

  useEffect(() => {

    const token = localStorage.getItem('token')

    const fetchRecords = async() => {
      try{
        const response = await axios.get(apiRoutes.fetchReportListForChecker, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const modifiedData = response.data.data.map((record) => ({
          ...record,
          key: record.id,
        }));
        
        console.log(modifiedData)

        setDataSource(modifiedData);

      } catch (error) {
        console.log(error)
      }
    }

    fetchRecords();
    
  }, [])

  const columns = [
    {
      title: 'Report Name',
      dataIndex: 'reportName',
      key: 'reportName',
      width: 150,
    },
    {
      title: 'Report Group',
      dataIndex: 'ReportGroup',
      key: 'ReportGroup',
      width: 150, // Adjust width as needed
      render: (text, record) => record.ReportGroup.reportGroupName,
    },
    {
      title: 'Currency',
      dataIndex: 'reportPriceCurrency',
      key: 'reportPriceCurrency',
      width: 20,
      align: 'center',
    },
    {
      title: 'Price (BDT)',
      dataIndex: 'reportPrice',
      key: 'reportPrice',
      width: 50,
      align: 'center',
    },
    {
      title: 'Description',
      dataIndex: 'reportDescription',
      key: 'reportDescription',
      width: 50,
    },
    {
      title: 'Mode',
      dataIndex: 'mode',
      key: 'mode',
      width: 20,
      align: 'center',
      render: (mode) => {
        let color = mode === 'n' ? 'geekblue' : 'volcano';
        let text = mode === 'n' ? 'new' : 'ammend'
    
        return (
          <Tag color={color}>
            {text.trim().toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 50,
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedTableRows(selectedRows)     
    },
    getCheckboxProps: (record) => ({
      name: record.id,
    }),
    type: "checkbox"
  };

  const approveHandler = () => {

    if (selectedTableRows.length === 0) {
      return;
    }

    const token = localStorage.getItem('token')

    const approveRecords = async () => {
      setButtonLoad(true);

      for (const row of selectedTableRows){
        try{

          const response = await axios.put(apiRoutes.approveReport + row.id, row, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setDataSource(prevDataSource =>
            prevDataSource.filter(item => item.userId !== row.userId)
          );

          openNotification('success', "Success", "Report Approved Successfully")

        } catch (error) {
          console.log(error);
          openNotification('error', "Error", "Error Approving Report")
        }
      }
  
      setButtonLoad(false);
    }

    approveRecords();
    
  }

  const rejectHandler = () => {

    if (selectedTableRows.length === 0) {
      return;
    }

    const token = localStorage.getItem('token')

    const rejectRecords = async () => {
      setButtonLoad(true);

      for (const row of selectedTableRows){
        try{

          const response = await axios.put(apiRoutes.rejectReport + row.id, row, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setDataSource(prevDataSource =>
            prevDataSource.filter(item => item.reportName !== row.reportName)
          );

          openNotification('success', "Success", "Record Sent To Maker End")

        } catch (error) {
          console.log(error);
          openNotification('error', "Error", error.response.data.message)
        }
      }
  
      setButtonLoad(false);
    }

    rejectRecords();
    
  }


  return (
    <main>
        <PageTitle pageHeader={"Report Checker"}/>
        <div>
          <Table dataSource={dataSource} columns={columns} rowSelection={rowSelection} className="border rounded-md"/>
        
          {
            dataSource.length > 0 &&

            <div className="mt-9 w-full flex justify-center">
              <Button type="primary" className="mr-2" loading={buttonLoad} onClick={approveHandler}>Approve</Button>
              <Button danger className="ml-2" loading={buttonLoad} onClick={rejectHandler}>Reject</Button>
            </div>
          }

        </div>
    </main>
  )
}

export default ReportChecker