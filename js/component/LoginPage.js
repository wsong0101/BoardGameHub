import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { userActions } from '../action'
import { inputRules } from '../common'

import { Row, Col, Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './LoginPage.css'

function LoginPage() {
    const [submitted, setSubmitted] = useState(false)
    const loggingIn = useSelector(state => state.authentication.loggingIn)
    const dispatch = useDispatch()

    // reset login status
    useEffect(() => { 
        dispatch(userActions.logout())
    }, []);

    function onFinish(inputs) {
        console.log(inputs)
        setSubmitted(true)
        if (username && password) {
            dispatch(userActions.login(username, password))
        }
    }

    return (
        // <div className="col-lg-8 offset-lg-2">
        //     <h2>Login</h2>
        //     <form name="form" onSubmit={handleSubmit}>
        //         <div className="form-group">
        //             <label>Username</label>
        //             <input type="text" name="username" value={username} onChange={handleChange} className={'form-control' + (submitted && !username ? ' is-invalid' : '')} />
        //             {submitted && !username &&
        //                 <div className="invalid-feedback">Username is required</div>
        //             }
        //         </div>
        //         <div className="form-group">
        //             <label>Password</label>
        //             <input type="password" name="password" value={password} onChange={handleChange} className={'form-control' + (submitted && !password ? ' is-invalid' : '')} />
        //             {submitted && !password &&
        //                 <div className="invalid-feedback">Password is required</div>
        //             }
        //         </div>
        //         <div className="form-group">
        //             <button className="btn btn-primary">
        //                 {loggingIn && <span className="spinner-border spinner-border-sm mr-1"></span>}
        //                 Login
        //             </button>
        //             <Link to="/register" className="btn btn-link">Register</Link>
        //         </div>
        //     </form>
        // </div>
        <Row>
            <Col span={8} offset={8}>
                <Form name="normal_login" className="login-form" initialValues={{ remember: true }} size="large"
                    onFinish={onFinish}>
                    <Form.Item name="username" rules={inputRules.username()}>
                        <Input prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="example@sample.com" />
                    </Form.Item>

                    <Form.Item name="password" rules={inputRules.password()}>
                        <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password"
                            placeholder="비밀번호" />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>로그인 상태 유지</Checkbox>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            로그인
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}

export { LoginPage }