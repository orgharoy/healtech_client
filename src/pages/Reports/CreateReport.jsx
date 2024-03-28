import React, {useState, useEffect, useContext} from 'react'
import { Form, Input, Select, Row, Col, Button, Table, Tag, Modal } from 'antd';
import {EditOutlined, ExclamationCircleFilled} from '@ant-design/icons'
import PageTitle from '../../components/PageTitle'
import axios from 'axios';
import apiRoutes from '../../api/endPoints';
import NotificationContext from '../../context/notificationContext.jsx';

const CreateReport = () => {
  const { confirm } = Modal;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [componentSize, setComponentSize] = useState('default');
  const [dataSource, setDataSource] = useState([]);
  const [activeReportList, setActiveReportList] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('BDT');
  const [buttonLoad, setButtonLoad] = useState(false);
  const [selectedTableRows, setSelectedTableRows] = useState([]);
  const [updateRecord, setUpdateRecord] = useState(null);
  const { openNotification } = useContext(NotificationContext);

  useEffect(()=> {
    const token = localStorage.getItem('token')

    const fetchRecords = async() => {
      try{
        const response = await axios.get(apiRoutes.fetchReportListForMaker, {
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
        openNotification('error', 'Error Fetching Data', error.response.data.message)
        console.log(error)
      }
    }

    const fetchReportGroups = async() => {
      try{
        const response = await axios.get(apiRoutes.fetchActiveReportGroups, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log(response.data.data)
        setActiveReportList(response.data.data);

      } catch (error) {
        openNotification('error', 'Error Fetching Data', error.response.data.message)
        console.log(error)
      }
    }

    fetchRecords();
    fetchReportGroups();
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
        mode: 'new',
        key: `new${dataSource.length + 1}`,
      };
  
      const newDataSource = [newFormValues, ...dataSource ];
      setDataSource(newDataSource);
    }
  
    setUpdateRecord(null);
    form.resetFields();
  };

  const onFinishFailed = async (formValues) => {
  }

  const rules = {

    reportName : [
      { required: true, message: 'Report Name is Required',},
    ],

    reportDescription : [
      { required: true, message: 'Report Description is Required',},
    ],

    reportGroup : [
      { required: true, message: 'Report Group is Required',},
    ],

    reportPrice : [
      { required: true, message: 'Report Price is Required',},
    ],

  };

  const filterOptionClient = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  const onReset = () => {
    setUpdateRecord(null);
    form.resetFields();
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
      dataIndex: 'reportGroupId',
      key: 'reportGroupId',
      width: 150,
      render: (reportGroupId) => {
        const reportGroup = activeReportList.find(group => group.id === reportGroupId);
        return reportGroup ? reportGroup.reportGroupName : 'Unknown'; // If report group is found, display its name, else display 'Unknown'
      },
    },
    {
      title: 'Report Price (Tk)',
      dataIndex: 'reportPrice',
      key: 'reportPrice',
      width: 50,
    },
    {
      title: 'Mode',
      dataIndex: 'mode',
      key: 'mode',
      width: 20,
      align: 'center',
      render: (status) => {
        let color = status === 'n' ? 'geekblue' : status === 'new' ? 'geekblue' : status === 'a' ? 'green' : 'volcano';
        let text = status === 'n' ? 'new' : status === 'a' ? 'ammend' : status === 'new' ? 'new' : status;
        return (
          <Tag color={color}>
            {text.trim().toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Report Description',
      dataIndex: 'reportDescription',
      key: 'reportDescription',
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
              
              if(row.mode === "new"){
        
                setDataSource(prevDataSource =>
                  prevDataSource.filter(item => item.reportName !== row.reportName)
                );

                openNotification("success", "Successfully Deleted", "Report deleted successfully")

              } else if (row.mode === "a" || row.mode === 'n') {
        
                const response = await axios.put(apiRoutes.deleteReportFromMaker + row.id, row, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
        
                const notificationTitle = response.data.status === 'success' ? 'Successfully Deleted' : 'Unsuccessful';
                const status = response.data.status === 'success' ? 'success' : 'error';
        
                openNotification(status, notificationTitle, response.data.message)
        
                if(status === 'success'){
                  setDataSource(prevDataSource =>
                    prevDataSource.filter(item => item.reportName !== row.reportName)
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

    setButtonLoad(true)

    for (const row of selectedTableRows) {

      if(row.mode === 'new'){

        const formValues = {
          reportName : row.reportName,
          reportGroupId : row.reportGroupId,
          reportDescription : row.reportDescription,
          reportPrice : row.reportPrice,
        }

        try{

          console.log(formValues)
          const response = await axios.post(apiRoutes.createNewReport, formValues, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if(response.data.status === "success"){

            setDataSource(prevDataSource =>
              prevDataSource.filter(item => item.reportName !== row.reportName)
            );

            openNotification('success', 'Report Created', 'Report successfully created')

          } else {
            openNotification('error', 'Error', response.data.message)
          }

        } catch (error){
          console.log(formValues)
          console.log(error);
          openNotification('error', 'Error', error.response.data.message)
        }

      } else {
        try{

          const response = await axios.put(apiRoutes.updateReportFromMaker + row.id, row, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if(response.data.status === "success"){

            setDataSource(prevDataSource =>
              prevDataSource.filter(item => item.reportName !== row.reportName)
            );

            openNotification('success', 'Report Created', 'Report successfully updated')

          } else {
            openNotification('error', 'Error', response.data.message)
          }

        } catch (error){
          console.log(error);
        }
      }

    }

    setButtonLoad(false)

  }

  return (
    <main className="w-full">
        <PageTitle pageHeader={"Create Report"}/>
        <Form
        form={form}
        labelCol={{ span: 7, offset: 0 }}
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

            <Form.Item label="Report Name:" name="reportName" labelAlign='left' rules={rules.reportName}>
              <Input />
            </Form.Item>

            <Form.Item label="Report Description:" name="reportDescription" labelAlign='left' rules={rules.reportDescription}>
              <TextArea rows={4} />
            </Form.Item>

          </Col>

          <Col xs={24} md={12}>

            <Form.Item label="Report Group:" name="reportGroupId" labelAlign='left' rules={rules.reportGroup}>
              <Select defaultValue="Select Group" showSearch filterOption={filterOptionClient}> 
                {activeReportList.map(reportGroup => (
                  <Select.Option key={reportGroup.id} value={reportGroup.id}>
                    {reportGroup.reportGroupName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Report Price:" labelAlign='left' name="reportPrice" rules={rules.reportPrice}>
              <Input placeholder='0' addonBefore={selectedCurrency} />
            </Form.Item>

          </Col>

        </Row>
        
        <Form.Item className="mt-5 flex justify-center">
          <Button type="primary" htmlType="submit" loading={buttonLoad} className='mr-2'>
            {updateRecord != null ? 'Update Record' : 'Create New Report'}
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
            <Button type="primary" className="mr-2" onClick={handleSubmit}>Save</Button>
            <Button danger className="ml-2" onClick={deleteRow}>Delete</Button>
          </div>
        </div>
      )}

    </main>
  )
}

export default CreateReport