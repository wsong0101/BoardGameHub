import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit';

import { userActions } from '../action'
import { inputRules } from '../common'

import { Row, Col, Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './LoginPage.css'

function LoginPage() {
    let query = new URLSearchParams(useLocation().search)
    const dispatch = useDispatch()
    const loggingIn = useSelector(state => state.auth.loggingIn)

    function onFinish(inputs) {
        dispatch(userActions.login(inputs.username, inputs.password, inputs.remember, query.get("url")))
    }

    return (
        <Row>
            <Col lg={{span: 8, offset: 8}} md={{span: 12, offset: 6}} xs={{span: 24}}>
                <Form name="login" className="login-form" initialValues={{ remember: false }} size="large"
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
                        <Button type="primary" htmlType="submit" className="login-form-button"
                            loading={loggingIn}>
                            로그인
                        </Button>
                    </Form.Item>
                </Form>
                <div className="text-center">
                    <Link to="/" className="mx-2">아이디 찾기</Link>/ 
                    <Link to="/" className="mx-2">비밀번호 찾기</Link>/ 
                    <Link to="/register" className="mx-2">회원 가입</Link>
                </div>
            </Col>
        </Row>
    )
}

export { LoginPage }