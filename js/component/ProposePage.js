import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { history } from '../helper'
import { inputRules } from '../common'
import { Form, Input, Button, Modal } from 'antd'
import { itemActions } from '../action';

function ProposePage() {
    const dispatch = useDispatch()
    const propose = useSelector( state => state.item.propose )
    if (!propose) {
        Modal.error({
            title: "비정상 접근",
            content: "정상적인 경로로 접근해주세요.",
            onOk: () => { history.push("/") }
        })
        return <div></div>
    }

    const onFinish = (inputs) => {
        dispatch(itemActions.proposeKorean({
            type: propose.type,
            id: propose.id,
            value: inputs.korean,
            path: propose.path,
        }))
    }

    return (
        <div>
            <h3 className="mb-3">{propose.value}</h3>
            <Form name="propose" size="large" layout="inline" onFinish={onFinish}>
                <Form.Item name="korean" rules={inputRules.geekusername()}>
                    <Input placeholder="한글 이름" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        제안하기
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export { ProposePage }