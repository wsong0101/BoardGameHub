import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { userActions } from '../action'
import { inputRules, IUser } from '../common'

import { Row, Col, Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { RootState } from '../reducer'

function RegisterPage() {
  const registering = useSelector((state: RootState) => state.register.registering)
  const dispatch = useDispatch()
  
  function onFinish(inputs: any) {
    dispatch(userActions.register({...inputs, ID: 0}))
  }

  return (
    <Row>
      <Col lg={{span: 8, offset: 8}} md={{span: 12, offset: 6}} xs={{span: 24}}>
        <Form name="register" className="register-form" size="large" onFinish={onFinish}>
          <Form.Item name="Email" rules={inputRules.username()}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="example@sample.com" />
          </Form.Item>

          <Form.Item name="Nickname" rules={inputRules.nickname()}>
            <Input placeholder="닉네임" />
          </Form.Item>
          
          <Form.Item name="Password" rules={inputRules.password()}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password"
                placeholder="비밀번호" />
          </Form.Item>
          
          <Form.Item name="PasswordRe" rules={inputRules.passwordRe()}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password"
                placeholder="비밀번호 재입력" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={registering}>
                회원가입
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export { RegisterPage }