import React, {useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { Table, Modal } from 'antd'
import apiRoutes from '../../api/endPoints';
import {EditOutlined, ExclamationCircleFilled} from '@ant-design/icons'
import NotificationContext from '../../context/notificationContext.jsx';

const UserList = () => {
  const { confirm } = Modal;
  const [dataSource, setDataSource] = useState([]);
  const { openNotification } = useContext(NotificationContext);

  useEffect(() => {
    const token = localStorage.getItem('token')

    const fetchUser =  async () => {
      try{
        const response = await axios.get(apiRoutes.fetchActiveUsers, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        setDataSource(response.data.data);

      } catch (error) {
        console.log(error)
      }
    }

    fetchUser();

  }, [])

  const editRow = (record) => {
    confirm({
      title: `Update ${record.userName}'s Profile?`,
      icon: <ExclamationCircleFilled />,
      content: 'This will send this profile to maker end',
      cancelText: 'No',
      okText: 'Yes',
      okType: 'danger',
      mask: 'true',
      maskClosable: 'true',

      onOk() {

        return new Promise(async (resolve, reject) => {
          const token = localStorage.getItem('token')
  
          try {
            const response = await axios.put(apiRoutes.editActiveUser + record.id, record, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            openNotification('success', 'Success', 'Data Successfully Sent to Maker') 

            setDataSource(prevDataSource =>
              prevDataSource.filter(item => item.id !== record.id)
            );

            resolve(response.data);

          } catch (err) {
            openNotification('error', 'Error Deleting Data', err.response.data.message) ;
            reject(err);
          }
        });
      },
    });
  };


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
      title: '',
      key: 'operation',
      align: 'center',
      width: 10,
      render: (text, record) => (
        <EditOutlined
          className="hover:text-[#6546de] cursor-pointer"
          onClick={() => editRow(record)}
        />
      ),    
    },
  ];

  return (
    <main>
      <Table dataSource={dataSource} columns={columns} className="border rounded-md"/>
    </main>
  )
}

export default UserList