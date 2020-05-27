import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { userActions } from '../action'
import { inputRules } from '../common'

import { Row, Col, Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';

function RegisterPage() {
  const registering = useSelector(state => state.get('registration').get('registering'))
  const dispatch = useDispatch()
  
  function onFinish(inputs) {
    dispatch(userActions.register(inputs))
  }

  return (
    <Row>
      <Col lg={{span: 8, offset: 8}} md={{span: 12, offset: 6}} xs={{span: 24}}>
        <Form name="register" className="register-form" size="large" onFinish={onFinish}>
          <Form.Item name="username" rules={inputRules.username()}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="example@sample.com" />
          </Form.Item>

          <Form.Item name="nickname" rules={inputRules.nickname()}>
            <Input placeholder="닉네임" />
          </Form.Item>
          
          <Form.Item name="password" rules={inputRules.password()}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password"
                placeholder="비밀번호" />
          </Form.Item>
          
          <Form.Item name="passwordRe" rules={inputRules.passwordRe()}>
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