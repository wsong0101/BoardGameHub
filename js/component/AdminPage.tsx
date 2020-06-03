import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { adminActions } from '../action'

import { List, Button } from 'antd'
import { RootState } from '../reducer'

function AdminPage() {
  const dispatch = useDispatch()
  const admin = useSelector((state: RootState) => state.admin)

  useEffect(() => {
    dispatch(adminActions.getProposes())
  }, [])

  function sendAccept(id: number) {
    dispatch(adminActions.acceptPropose(id))
  }

  function sendDelete(id: number) {
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
              <Button type="ghost" className="mr-2" onClick={() => {sendDelete(item.ID)}}>삭제</Button>
              <Button type="primary" onClick={() => {sendAccept(item.ID)}}>승인</Button>
            </div>
          </List.Item>
        )}
      />
  )
}

export { AdminPage }