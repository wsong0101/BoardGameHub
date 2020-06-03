import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { inputRules } from '../common'
import { Util } from '../util'

import { Row, Col, Spin, Form, Input, Button, Alert } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import { itemActions } from '../action';

import './CollectionPage.css'

function ImportPage() {
    const dispatch = useDispatch()
    const collection = useSelector(state => state.collection)
    const item = useSelector(state => state.item)

    const onFinish = (input) => {
        dispatch(itemActions.importGeek(input.geekname))
    }

    const importItem = (geekId) => {
        dispatch(itemActions.importGeekItem(geekId))
    }

    const drawButton = (geekId, isExist) => {
        if (isExist) {
            return (
                <h3 className="text-success"><i className="fas fa-check"></i></h3>
            )
        }
        return (
            <Button loading={item.importing} onClick={() => { importItem(geekId) }}>
                DB에 추가
            </Button>
        )
    }

    let items = []
    if (collection.importing) {
        items = (
            <Col>
                <Spin size="large" />
            </Col>
        )
    } else if (collection.collection) {
        for (const e of collection.collection) {
            items.push(
                <Col key={e.ID} xl={{span: 3}} lg={{span: 4}} md={{span: 6}} xs={{span: 12}}>
                    <div className="h-100 border rounded d-flex flex-column justify-content-center">
                        <div className="card-img-div flex-grow-1 d-flex flex-column justify-content-center p-1">
                            <img src={e.Thumbnail} className="card-img rounded-top"/>
                        </div>
                        <div className="p-2">
                            <div className="pt-2">
                                {Util.getName(e)}
                            </div>
                            <div className="pt-2">
                                {drawButton(e.ID, e.IsExistInDB)}
                            </div>
                        </div>
                    </div>
                </Col>    
            )
        }
    }

    return (
        <div>
            <Alert message="※ 주의: 가져오기를 실행하면 내 책장을 덮어씁니다." type="warning" showIcon />
            <Form name="import" size="large" layout="inline" onFinish={onFinish}
                style={{ marginBottom: '30px', marginTop: '15px' }}>                    
                <Form.Item name="geekname" rules={inputRules.geekusername()}>
                    <Input prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="BGG 유저 이름" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={collection.importing}>
                        가져오기
                    </Button>
                </Form.Item>
            </Form>
            <Row gutter={[12, 12]}>
                {items}
            </Row>
        </div>
    )
}

export { ImportPage }