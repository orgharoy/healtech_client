import React, { useState, useEffect, useContext } from 'react'
import PageTitle from '../../components/PageTitle'
import axios from 'axios';
import apiRoutes from '../../api/endPoints';
import { runes } from 'runes2';
import { Form, Input, Modal, Radio, Row, Col, Button, Table, Tag, InputNumber } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import NotificationContext from '../../context/notificationContext.jsx';
import Report from '../../components/PDFReports/Report.jsx';
import { saveAs } from 'file-saver';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

const CreatePatientRecord = () => {
  const { openNotification } = useContext(NotificationContext);
  const [selectedCurrency, setSelectedCurrency] = useState('BDT');
  const [buttonLoad, setButtonLoad] = useState(false);
  const [form] = Form.useForm();
  const [componentSize, setComponentSize] = useState('default');
  const [updateRecord, setUpdateRecord] = useState(null);
  const [selectedTableRows, setSelectedTableRows] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [visitType, setVisitType] = useState('New');
  const [contactExtention, setContactExtension] = useState("+880")
  const [patientId, setPatientId] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [patientDetails, setPatientDetails] = useState([]);
  const [billDetails, setBillDetails] = useState([])
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility


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

        setDataSource(modifiedData);

      } catch (error) {
        openNotification('error', 'Error Fetching Data', error.response.data.message)
        console.log(error)
      }
    }

    fetchRecords();
  }, [])

  useEffect(() => {
    const fetchPatientDetails = async() => {

      const contactWithExtension = contactNumber == '' ? '' : contactExtention + contactNumber;
      const token = localStorage.getItem('token')

      try{
        const response = await axios.post(apiRoutes.fetchPatientRecords, {patientId, contactWithExtension}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setVisitType('Revisit')

        setPatientDetails([response.data.data]);

        const patientData = response.data.data;

        form.setFieldsValue({
          uniquePatientId: patientData.uniquePatientId,
          patientName: patientData.patientName,
          patientAge: patientData.patientAge,
          patientGender: patientData.patientGender,
          patientContactNumber: patientData.patientContactNumber,
        });

      } catch (error) {
        setVisitType('New')
        setPatientDetails([]);
        //openNotification('error', 'Error Fetching Data', error.response.data.message)
        console.log(error.response)
      }
    }
    fetchPatientDetails()

  }, [patientId, contactNumber])

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onFinish = async (formValues) => {

    formValues.patientContactNumber = contactExtention + formValues.patientContactNumber

    const finalValues = {
      ...formValues,
      visitType,
      selectedReports: selectedTableRows
    }

    const token = localStorage.getItem('token')

    if (selectedTableRows.length === 0) {
      return;
    }

    setButtonLoad(true)

    try{
      const response = await axios.post(apiRoutes.postNewPatientRecord, finalValues, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBillDetails([response.data])
      setModalVisible(true);
    }
    catch(err){
      openNotification('error', 'Error Fetching Data', err.response.data.message)
      console.log(err.response)
    } finally{
      setButtonLoad(false)
    }

  };

  const onFinishFailed = async (formValues) => {

  }

  const rules = {

    patientName : [
      { required: true, message: 'Patient Name is Required',},
    ],

    patientAge : [
      { required: true, message: 'Patient Age is Required',},
    ],

    patientGender: [
      { required: true, message: 'Patient Gender is Required',},
    ],

    patientContactNumber : [
      { required: true, message: 'Patient Contact Number is Required',},
      {
        pattern: /^1[0-9]{9}$/, // Regex pattern to match numbers starting with 1 followed by exactly 9 digits
        message: 'Patient Contact Number must start with 1 and contain exactly 10 digits',
      },
    ],  

    reportGroup : [
      { required: true, message: 'Report Group is Required',},
    ],

    amountPaid : [
      { required: true, message: 'Paid Ammount is Required',},
    ],

  };

  const onReset = () => {
    setUpdateRecord(null);
    setVisitType('New') 
    setPatientDetails([]);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Report Name',
      dataIndex: 'reportName',
      key: 'reportName',
      width: 75,
    },
    {
      title: 'Report Group',
      dataIndex: 'ReportGroup',
      key: 'ReportGroup',
      width: 50, // Adjust width as needed
      render: (text, record) => record.ReportGroup.reportGroupName,
    },
    {
      title: 'Price (Tk)',
      dataIndex: 'reportPrice',
      key: 'reportPrice',
      width: 50,
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

  useEffect(() => {
    const totalPayable = selectedTableRows.reduce((total, row) => total + parseFloat(row.reportPrice), 0);
    const discountAmount = (totalPayable * discountPercentage) / 100;
    const amountToPay = totalPayable - discountAmount;

    form.setFieldsValue({
      amountToPay: totalPayable.toFixed(2),
      discountedAmountToPay: amountToPay.toFixed(2),
      amountDue: (amountToPay - amountPaid).toFixed(2)
      
    });
  }, [selectedTableRows, discountPercentage, amountPaid]);

  const handleDownloadReport = async () => {
    try{
      const templateData = await fetch('./report-templates/PatientreportTemplate.docx');
      const templateArrayBuffer = await templateData.arrayBuffer();
      const zip = new PizZip(templateArrayBuffer);
      const doc = new Docxtemplater().loadZip(zip);

      const data = {
        PATIENT_NAME: 'John Doe', // Example dynamic data
        // Add more dynamic data here as needed
      };

    doc.setData(data);
      doc.render();

      // Convert docx to PDF
      const pdfBytes = await this.convertToPdf(doc);

      saveAs(new Blob([pdfBytes]), 'output.pdf');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  convertToPdf = async (doc) => {
    try {
      const content = doc.getZip().generate({ type: 'blob' });
      const pdfDoc = await pdf.PDFDocument.load(content);
      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (error) {
      console.error('Error converting to PDF:', error);
      throw error;
    }
  };

  return (
    <main>
      <PageTitle pageHeader={"New Patient Record"}/>
      
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

            <Form.Item label="Unique Patient ID:" name="uniquePatientId" labelAlign='left'>
              <Input 
                disabled={patientDetails.length > 0}
                addonAfter={visitType} 
                onChange={(e) => setPatientId(e.target.value)} 
              />
            </Form.Item>

            <Form.Item label="Patient Name:" name="patientName" labelAlign='left' rules={rules.patientName}>
              <Input className="w-full"/>
            </Form.Item>

            <Form.Item label="Patient Age:" name="patientAge" labelAlign='left' rules={rules.patientAge}>
              <Input />
            </Form.Item>

            <Form.Item label="Patient Gender:" labelAlign='left' name="patientGender" rules={rules.patientGender}>
              <Radio.Group>
                <Radio.Button value="m">Male</Radio.Button>
                <Radio.Button value="f">Female</Radio.Button>
                <Radio.Button value="o">Other</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Contact Number:" name="patientContactNumber" labelAlign='left' rules={rules.patientContactNumber}>
              <Input 
                addonBefore={contactExtention} 
                count={{
                  show: true,
                  max: 10,
                  strategy: (txt) => runes(txt).length,
                  exceedFormatter: (txt, { max }) => runes(txt).slice(0, max).join(''),
                }}
                onChange={(e) => setContactNumber(e.target.value)} 
              />
            </Form.Item>

            <Form.Item label="Reference (If Any):" labelAlign='left' name="reference" >
              <Input />
            </Form.Item>

            <Form.Item label="Amount to be Paid:" labelAlign='left' name="amountToPay" >
              <Input placeholder='0' addonBefore={selectedCurrency} disabled/>
            </Form.Item>

            <Form.Item label="Discount:" labelAlign='left' name="discount" rules={rules.discount}>
              <InputNumber type="number" min="0" max="100" addonAfter="%" onChange={(value) => setDiscountPercentage(parseFloat(value))} />
            </Form.Item>

            <Form.Item label="After Discount:" labelAlign='left' name="discountedAmountToPay" >
              <Input placeholder='0' addonBefore={selectedCurrency} disabled/>
            </Form.Item>

            <Form.Item label="Amount Paid:" labelAlign='left' name="amountPaidReception" rules={rules.amountPaid}>
              <Input type='number' placeholder='0' addonBefore={selectedCurrency} onChange={(e) => setAmountPaid(parseFloat(e.target.value))}/>
            </Form.Item>

            <Form.Item label="Amount Due:" labelAlign='left' name="amountDue">
              <Input placeholder='0' addonBefore={selectedCurrency} disabled/>
            </Form.Item>

          </Col>

          <Col xs={24} md={12}>
            <Table dataSource={dataSource} columns={columns} rowSelection={rowSelection} className="border rounded-md"/>            
          </Col>

        </Row>
        
        <Form.Item className="mt-5 flex justify-center">
          <Button type="primary" htmlType="submit" loading={buttonLoad} className='mr-2'>
            Register New Patient
          </Button>
          <Button htmlType="button" onClick={onReset} className='ml-2'>
            Clear Fields
          </Button>
        </Form.Item>

      </Form>

      <Modal
        title={
          <span>
            <CheckCircleOutlined style={{ color: '#6546de', marginRight: '8px' }} />
            Patient Record Created
          </span>
        }
        //visible={modalVisible} 
        visible = {true}
        onCancel={() => setModalVisible(false)}
        footer={[
          <>
            <Button type='primary' onClick={handleDownloadReport}>
              Download Report
            </Button>
            <Button key="close" onClick={() => setModalVisible(false)} danger>
              Close
            </Button>
            
          </>
        ]}
      >
        {
          billDetails.length > 0  &&
          <div>
            <p>Your patient record has been created successfully.</p>
          </div>
        }
          
      </Modal>

    </main>
  )
}

export default CreatePatientRecord