import React, { useState, useEffect, useContext } from 'react'
import PageTitle from '../../components/PageTitle'
import { Form, Input, Modal, Radio, Row, Col, Button, Table, Tag, InputNumber } from 'antd';
import { runes } from 'runes2';
import axios from 'axios';
import apiRoutes from '../../api/endPoints';
import { CheckCircleOutlined } from '@ant-design/icons';
import NotificationContext from '../../context/notificationContext.jsx';

const ReportDisbursement = () => {
  const [form] = Form.useForm();
  const [componentSize, setComponentSize] = useState('default');
  const [billNumber, setBillNumber] = useState('');
  const [patientDetails, setPatientDetails] = useState([]);
  const [contactExtention, setContactExtension] = useState("+880")
  const [selectedCurrency, setSelectedCurrency] = useState('BDT');
  const [buttonLoad, setButtonLoad] = useState(false);
  const [duePayment, setDuePayment] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [billDetails, setBillDetails] = useState([]);
  const { openNotification } = useContext(NotificationContext);

  useEffect(()=> {
    const fetchPatientDetails = async() => {

      const token = localStorage.getItem('token')

      try{
        const response = await axios.get(apiRoutes.fetchBillDetails + billNumber, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log(response.data.data);
        const patientData = response.data.data;

        form.setFieldsValue({
          uniquePatientId: patientData.Patient.uniquePatientId,
          patientName: patientData.Patient.patientName,
          patientAge: patientData.Patient.patientAge,
          patientGender: patientData.Patient.patientGender,
          patientContactNumber: patientData.Patient.patientContactNumber,
          reference: patientData.reference,
          amountToPay: patientData.amountToPay,
          discount: patientData.discount,
          discountedAmountToPay: patientData.discountedAmountToPay,
          amountPaidReception: patientData.amountPaidReception,
          amountPaidFinalStage: patientData.amountPaidFinalStage,
          amountDue: patientData.amountDue
        });

      } catch (error) {
        console.log(error);
      }
    }
    fetchPatientDetails()

  }, [billNumber])

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  const onFinish = async (formValues) => {
    const token = localStorage.getItem('token')
    setButtonLoad(true)
    try{
      console.log(formValues)
      const response = await axios.put(apiRoutes.updateBillDetails, formValues, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response)
      setBillDetails([response.data])
      setModalVisible(true);

      form.resetFields();

    }
    catch(err){
      openNotification('error', 'Error Fetching Data', err.response.data.message)
      console.log(err)
    } finally{
      setButtonLoad(false)
    }
  };

  const onFinishFailed = async (formValues) => {

  }

  const rules = {

    billNumber: [
      { required: true, message: 'Bill Number is Required',},
    ],

    uniquePatientId: [
      { required: true, message: 'Bill Number is Required',},
    ],

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
        pattern: /^1[0-9]{9}$/,
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
    setPatientDetails([]);
    form.resetFields();
  };

  useEffect(() => {
    const afterDiscount = parseFloat(form.getFieldValue('discountedAmountToPay'))
    const alreadyPaid = parseFloat(form.getFieldValue('amountPaidReception'))
    const amountToPay = afterDiscount - alreadyPaid
    const newAmountDue = parseFloat(amountToPay - duePayment);

    form.setFieldsValue({
      amountDue: newAmountDue.toFixed(2),
    });
  }, [form, duePayment]);

  const handleViewReport = () => {
    const newWindow = window.open('http://localhost:5173/report/view', '_blank', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=750');
  };

  return (
    <main>
      <PageTitle pageHeader={"Report Disbursement"}/>

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

            <Form.Item label="Bill Number:" name="billNumber" labelAlign='left' rules={rules.billNumber}>
              <Input onChange={(e) => setBillNumber(e.target.value)} />
            </Form.Item>

            <Form.Item label="Unique Patient ID:" name="uniquePatientId" labelAlign='left' rules={rules.uniquePatientId}>
              <Input disabled/>
            </Form.Item>

            <Form.Item label="Patient Name:" name="patientName" labelAlign='left' rules={rules.patientName}>
              <Input className="w-full" disabled/>
            </Form.Item>

            <Form.Item label="Patient Age:" name="patientAge" labelAlign='left' rules={rules.patientAge}>
              <Input disabled/>
            </Form.Item>

            <Form.Item label="Patient Gender:" labelAlign='left' name="patientGender" rules={rules.patientGender}>
              <Radio.Group disabled>
                <Radio.Button value="m">Male</Radio.Button>
                <Radio.Button value="f">Female</Radio.Button>
                <Radio.Button value="o">Other</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Contact Number:" name="patientContactNumber" labelAlign='left' rules={rules.patientContactNumber}>
              <Input addonBefore={contactExtention} disabled />
            </Form.Item>

          </Col>
          <Col xs={24} md={12}>

            <Form.Item label="Reference (If Any):" labelAlign='left' name="reference" >
              <Input disabled/>
            </Form.Item>

            <Form.Item label="Amount to be Paid:" labelAlign='left' name="amountToPay" >
              <Input placeholder='0' addonBefore={selectedCurrency} disabled/>
            </Form.Item>

            <Form.Item label="Discount:" labelAlign='left' name="discount" rules={rules.discount}>
              <InputNumber type="number" min="0" max="100" addonAfter="%" disabled />
            </Form.Item>

            <Form.Item label="After Discount:" labelAlign='left' name="discountedAmountToPay" >
              <Input placeholder='0' addonBefore={selectedCurrency} disabled />
            </Form.Item>

            <Form.Item label="Already Paid:" labelAlign='left' name="amountPaidReception" rules={rules.amountPaid}>
              <Input type='number' placeholder='0' addonBefore={selectedCurrency} disabled/>
            </Form.Item>

            <Form.Item label="Due Payment:" labelAlign='left' name="amountPaidFinalStage" rules={rules.amountPaid}>
              <InputNumber min={0} addonBefore={selectedCurrency} onChange={(e) => setDuePayment(parseFloat(e))}/>
            </Form.Item>

            <Form.Item label="Amount Due:" labelAlign='left' name="amountDue">
              <InputNumber placeholder='0' addonBefore={selectedCurrency} disabled/>
            </Form.Item>
            
          </Col>
        </Row>
        <Form.Item className="mt-5 flex justify-center">
          <Button type="primary" htmlType="submit" loading={buttonLoad} className='mr-2'>
            Submit
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
        visible={modalVisible} 
        //visible = {true}
        onCancel={() => setModalVisible(false)}
        footer={[
          <>
            <Button type='primary' onClick={handleViewReport}>
              View Report
            </Button>
            <Button>
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

export default ReportDisbursement