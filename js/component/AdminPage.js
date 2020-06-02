import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { adminActions } from '../action'

import { List, Button } from 'antd'

function AdminPage() {
  const dispatch = useDispatch()
  const admin = useSelector(state => state.admin)

  useEffect(() => {
    dispatch(adminActions.getProposes())
  }, [])

  const sendAccept = (id) => {
    dispatch(adminActions.acceptPropose(id))
  }

  const sendDelete = (id) => {
    dispatch(adminActions.deletePropose(id))
  }

  if (!admin.proposes) {
    return <div></div>
  }

  return (
      <List
        bordered
        dataSource={admin.proposes}
        renderItem={item => (
          <List.Item>
            {item.OriginalValue}<i className="fas fa-arrow-right mx-3"></i>{item.Value}
            <div className="float-right" style={{marginTop: '-5px'}}>
              <Button type="danger" className="mr-2" onClick={() => {sendDelete(item.ID)}}>삭제</Button>
              <Button type="primary" onClick={() => {sendAccept(item.ID)}}>승인</Button>
            </div>
          </List.Item>
        )}
      />
  )
}

export { AdminPage }