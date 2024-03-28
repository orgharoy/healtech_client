import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, Select, Table, Row, Col, Button, Tag, Modal } from 'antd';
import {EditOutlined, ExclamationCircleFilled} from '@ant-design/icons'
import apiRoutes from '../../api/endPoints.js';
import axios from 'axios';
import NotificationContext from '../../context/notificationContext.jsx';

const CreateUser = () => {
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const [componentSize, setComponentSize] = useState('default');
  const [buttonLoad, setButtonLoad] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [selectedTableRows, setSelectedTableRows] = useState([]);
  const { openNotification } = useContext(NotificationContext);

  useEffect(() => {

    const token = localStorage.getItem('token')

    const fetchRecords = async() => {
      try{
        const response = await axios.get(apiRoutes.fetchUserListForMaker, {
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

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onFinish = async (formValues) => {

    if (updateRecord !== null) {
      const updatedDataSource = dataSource.map((item) =>
        item.key === updateRecord.key ? { ...item, ...formValues } : item
      );
  
      setDataSource(updatedDataSource);
      setUpdateRecord(null);
    } else {
      const newFormValues = {
        ...formValues,
        mode: 'n',
        key: `new${dataSource.length + 1}`,
      };
  
      const newDataSource = [newFormValues, ...dataSource ];
      setDataSource(newDataSource);
    }
  
    setUpdateRecord(null);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    setButtonLoad(false);
  };

  const onReset = () => {
    form.resetFields();
    setUpdateRecord(null);
  };

  const rules = {
    userName: [
      { required: true, message: 'User Name is Required',},
    ],
    userId: [
      { required: true, message: 'User ID is Required',},
    ],
    password: updateRecord !== null && updateRecord.mode === 'a' ? [] : [
      { required: true, message: 'Please Enter New Password' },
      { pattern: new RegExp(/\d/), message: 'Must Have at least one Number',},
      { min: 8, message: 'Must Have a Minimum of 8 Characters',},
      { pattern: new RegExp(/^(?=.*[a-z])/), message: 'Must Have at least one Lowercase Letter',},
      { pattern: new RegExp(/^(?=.*[A-Z])/), message: 'Must Have at Least one Uppercase Letter',},
      { pattern: new RegExp(/^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/), message: 'Must Have at Least one Special Character',},
    ],
    confirmPassword: updateRecord !== null && updateRecord.mode === 'a' ? [] : [
      { required: true, message: 'Please Enter Password Again' },
      ({ getFieldValue }) => ({
        validator(_, value) {
          const newPassword = getFieldValue('password');
    
          if (!value || newPassword === value) {
            return Promise.resolve();
          }
    
          return Promise.reject('Passwords do not match');
        },
      }),
    ],
    role: [
      { required: true, message: 'Role is Required',},
    ],
    
  };

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
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

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedTableRows(selectedRows)     
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
    type: "checkbox"
  };

  const editRow = (record) => {
    form.setFieldsValue(record);
    setUpdateRecord(record);
  };

  const deleteRow = (record) => {
    confirm({
      title: `Are you sure you want to delete the selected records?`,
      icon: <ExclamationCircleFilled />,
      content: 'These records will be deleted',
      cancelText: 'No',
      okText: 'Yes',
      okType: 'danger',
      mask: 'true',
      maskClosable: 'true',

      onOk() {

        return new Promise(async (resolve, reject) => {
          const token = localStorage.getItem('token')
  
          try {
            setButtonLoad(true);
      
            for (const row of selectedTableRows) {
              
              if(row.mode === "n"){
        
                setDataSource(prevDataSource =>
                  prevDataSource.filter(item => item.userId !== row.userId)
                );

                openNotification("success", "Successfully Deleted", "User deleted successfully")

              } else if (row.mode === "a") {
        
                const response = await axios.put(apiRoutes.deleteUserFromMaker + row.id, row, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
        
                const notificationTitle = response.data.status === 'success' ? 'Successfully Deleted' : 'Unsuccessful';
                const status = response.data.status === 'success' ? 'success' : 'error';
        
                openNotification(status, notificationTitle, response.data.message)
        
                if(status === 'success'){
                  setDataSource(prevDataSource =>
                    prevDataSource.filter(item => item.userId !== row.userId)
                  );
                }  

              }

            }

            setButtonLoad(false);
            resolve('Deleted successfully');

          } catch (err) {
            setButtonLoad(false);
            openNotification('error', 'Error Deleting Data', err.response.data.message) ;
            reject(err);
          }
        });
      },
    });
  };

  
  const handleSubmit = async () => {

    const token = localStorage.getItem('token')

    if (selectedTableRows.length === 0) {
      return;
    }

    try {
      setButtonLoad(true);
  
      for (const row of selectedTableRows) {
        
        if(row.mode === "n"){

          const formValues = {
            userName : row.userName,
            userId : row.userId,
            password : row.password,
            confirmPassword : row.confirmPassword,
            role : row.role
          }
  
          const response = await axios.post(apiRoutes.createNewUser, formValues, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          const notificationTitle = response.data.status === 'success' ? 'User Created' : 'Unsuccessful';
          const status = response.data.status === 'success' ? 'success' : 'error';
  
          openNotification(status, notificationTitle, response.data.message)
  
          if(status === 'success'){
            setDataSource(prevDataSource =>
              prevDataSource.filter(item => item.userId !== row.userId)
            );
          }     

        } else if (row.mode === "a") {
  
          const response = await axios.put(apiRoutes.updateUserFromMaker + row.id, row, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          const notificationTitle = response.data.status === 'success' ? 'User Created' : 'Unsuccessful';
          const status = response.data.status === 'success' ? 'success' : 'error';
  
          openNotification(status, notificationTitle, response.data.message)
  
          if(status === 'success'){
            setDataSource(prevDataSource =>
              prevDataSource.filter(item => item.userId !== row.userId)
            );
          }  

        }

      }

      //setSelectedTableRows([]);

    } catch (error) {

      console.error('Error submitting rows:', error);

    } finally {
      setButtonLoad(false);
    }

  }


  return (
    <div>
      <Form
        form={form}
        labelCol={{ span: 7, offset: 0 }} // Set offset to 0 to left-align labels
        labelWrap
        layout="horizontal"
        initialValues={{ size: componentSize }}
        onValuesChange={onFormLayoutChange}
        size={componentSize}
        colon={false}
        onFinish={onFinish} 
        onFinishFailed={onFinishFailed} 
        autoComplete="off"
      >
        <Row gutter={22}>
          <Col xs={24} md={12}>

            <Form.Item label="User Name:" name="userName" labelAlign='left' rules={rules.userName}>
              <Input />
            </Form.Item>

            <Form.Item label="Password:" name="password" labelAlign='left' rules={rules.password} >
              <Input.Password disabled={updateRecord !== null && updateRecord.mode === 'a'}/>
            </Form.Item>

            <Form.Item label="Confirm Password:" name="confirmPassword" labelAlign='left' rules={rules.confirmPassword} >
              <Input.Password disabled={updateRecord !== null && updateRecord.mode === 'a'}/>
            </Form.Item>


          </Col>

          <Col xs={24} md={12}>

            <Form.Item label="User ID:" name="userId" labelAlign='left' rules={rules.userId}>
              <Input />
            </Form.Item>

            <Form.Item label="Role:" name="role" labelAlign='left' rules={rules.role}>
              <Select defaultValue="Select Role" showSearch > 
                <Select.Option key="Admin" value="admin">
                  Admin
                </Select.Option>
                <Select.Option key="User" value="user">
                  User
                </Select.Option>
              {/* {clientData.map(client => (
                <Select.Option key={client.clientId} value={client.clientId}>
                  {client.clientName}
                </Select.Option>
              ))} */}
              </Select>
            </Form.Item>

          </Col>

        </Row>

        <Form.Item className="mt-10 flex justify-center">
          <Button type="primary" htmlType="submit" loading={buttonLoad} className="mr-2">
            {updateRecord != null ? 'Update User' : 'Create New User'}
          </Button>
          <Button htmlType="button" onClick={onReset} className='ml-2'>
            Clear Fields
          </Button>
        </Form.Item>

      </Form>


      {dataSource.length > 0 && (
        <div className=" mt-16 ">
          <Table dataSource={dataSource} columns={columns} rowSelection={rowSelection} className="border rounded-md"/>

          <div className="mt-5 w-full flex justify-center">
            <Button type="primary" className="mr-2" onClick={handleSubmit} loading={buttonLoad} >Save</Button>
            <Button danger className="ml-2" onClick={deleteRow} loading={buttonLoad} >Delete</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateUser