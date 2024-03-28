import React, {useState, useEffect, useContext} from 'react'
import PageTitle from '../../components/PageTitle'
import { Table, Modal } from 'antd';
import {EditOutlined, ExclamationCircleFilled} from '@ant-design/icons'
import axios from 'axios';
import apiRoutes from '../../api/endPoints';
import NotificationContext from '../../context/notificationContext';


const ViewReports = () => {
  const { confirm } = Modal;
  const [dataSource, setDataSource] = useState([]);
  const { openNotification } = useContext(NotificationContext);

  useEffect(() => {
    const token = localStorage.getItem('token')
    const fetchRecords = async() => {
      try{
        const response = await axios.get(apiRoutes.fetchActiveUsers, {
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
            const response = await axios.put(apiRoutes.editActiveReport + record.id, record, {
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
      title: 'Price',
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
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
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
        <PageTitle pageHeader={"View Reports"}/>
        <Table dataSource={dataSource} columns={columns} className="border rounded-md"/>
    </main>
  )
}

export default ViewReports