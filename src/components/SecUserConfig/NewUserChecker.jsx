import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import apiRoutes from '../../api/endPoints'
import NotificationContext from '../../context/notificationContext.jsx';

import { Table, Tag, Button } from 'antd'

const NewUserChecker = () => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedTableRows, setSelectedTableRows] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const { openNotification } = useContext(NotificationContext);

  useEffect(() => {

    const token = localStorage.getItem('token')

    const fetchRecords = async() => {
      try{
        const response = await axios.get(apiRoutes.fetchUserListForChecker, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const modifiedData = response.data.data.map((record) => ({
          ...record,
          key: record.id,
        }));
    
        setDataSource(modifiedData);

      } catch (error) {
        console.log(error)
      }
    }

    fetchRecords();
    
  }, [])

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'id',
      width: 150,
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 50,
    },
    {
      title: 'User Role',
      dataIndex: 'role',
      key: 'role',
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

          const response = await axios.put(apiRoutes.approveUser + row.id, row, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setDataSource(prevDataSource =>
            prevDataSource.filter(item => item.userId !== row.userId)
          );

          openNotification('success', "Success", "User Approved Successfully")

        } catch (error) {
          console.log(error);
          openNotification('error', "Error", "Error Updating User")
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

          const response = await axios.put(apiRoutes.rejectUser + row.id, row, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          setDataSource(prevDataSource =>
            prevDataSource.filter(item => item.userId !== row.userId)
          );

          openNotification('success', "Success", "Record Sent To Maker End")

        } catch (error) {
          console.log(error);
          openNotification('error', "Error", "Error Sending Record to Maker End")
        }
      }
  
      setButtonLoad(false);
    }

    rejectRecords();
    
  }

  return (
    <main>
      <Table dataSource={dataSource} columns={columns} rowSelection={rowSelection} className="border rounded-md"/>


      {
        dataSource.length > 0 &&

        <div className="mt-9 w-full flex justify-center">
          <Button type="primary" className="mr-2" loading={buttonLoad} onClick={approveHandler}>Approve</Button>
          <Button danger className="ml-2" loading={buttonLoad} onClick={rejectHandler}>Reject</Button>
        </div>
      }
      

    </main>
  )
}

export default NewUserChecker