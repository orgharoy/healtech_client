import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import apiRoutes from '../api/endPoints.js';
import { Button, Form, Input, Alert } from 'antd';

const Login = () => {
    const [buttonLoad, setButtonLoad] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();

    const onFinish = async (values) => {

        setButtonLoad(true);

        try {
            const response = await axios.post(apiRoutes.login, values);

            const token = response.data.token
            const userName = response.data.user.userName 
            const userRole = response.data.user.role

            console.log(response)

            localStorage.setItem("token", token)
            localStorage.setItem("userName", userName)
            localStorage.setItem("role", userRole)

            setButtonLoad(false)

            navigate('/');
        
        } catch (error) {
            console.log(error)
            setButtonLoad(false);
            setAlertMessage(error.response.data.message);
        }

    };


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleClose = () => {
        setAlertMessage('');
    };

    return (
        <div className="loginBackground flex items-center justify-center">
            <div className="bg-white shadow-md rounded-md w-[350px] flex flex-col justify-between items-center px-5 pt-10 pb-5">
                <h1 className="font-semibold text-2xl">Welcome Back!</h1>
                {
                    alertMessage != '' && <Alert message={alertMessage} type="error" className="w-full mt-5" showIcon closable afterClose={handleClose}/>
                }
                <Form
                    name="basic"
                    labelCol={{span: 24, }}
                    wrapperCol={{ span: 24,}}
                    initialValues={{remember: true,}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"
                    className="w-full mt-7"
                >
                    <Form.Item
                        label="User Id"
                        name="userId"
                        rules={[{ required: true, message: 'Please enter your username!',},]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[ { required: true, message: 'Please enter your password!', },]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item className="w-full flex justify-center mt-14">
                        <Button type="primary" htmlType="submit" loading={buttonLoad}>
                            Submit
                        </Button>
                    </Form.Item>

                </Form>
            </div>
        </div>
    )
}

export default Login