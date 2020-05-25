import React from 'react'
import { Link } from 'react-router-dom';

import { Button, Result } from 'antd'

function RegisterWelcomePage() {
  return (
    <Result
      status="success"
      title="회원 가입을 축하합니다!"
      subTitle="사이트의 모든 기능을 이용하시려면 이메일 인증이 필요합니다."
      extra={[
        <Button type="primary" key="login" size="large">
          <Link to="/login">로그인</Link>
        </Button>,
      ]}
    />
  )
}

export { RegisterWelcomePage }