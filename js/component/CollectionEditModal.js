import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userActions } from '../action'

import { Util } from '../util'

import { Modal, Rate, Checkbox, Input } from 'antd'
const { TextArea } = Input;

export default function CollectionEditModal() {
  const dispatch = useDispatch()
  const modal = useSelector(state => state.get('modal'))
  const [memo, setMemo] = useState("")

  useEffect(() => {
    setMemo(getMemo(e))
  }, [modal])

  const onCancel = () => {
    dispatch(userActions.hideModal())
  }

  const getScore = (e) => {
    if (!e || !e.Score) {
      return 0.0
    }
    return e.Score / 2
  }

  const getMemo = (e) => {
    if (!e || !e.Memo) {
      return ""
    }
    return e.Memo
  }

  const getStatus = (e) => {
    if (!e) {
      return []
    }
    return e.Status
  }

  const e = modal.get('collection')
  console.log(e)

  const statusOptions = [
    { label: '보유중', value: 'own'},
    { label: '이전에 보유', value: 'prev_owned'},
    { label: '판매중', value: 'for_trade'},
    { label: '갖고싶음', value: 'want'},
    { label: '구매중', value: 'want_to_buy'},
    { label: '위시리스트', value: 'wishlist'},
    { label: '사전주문', value: 'preordered'},
  ]

  const sendUpdate = (type, value) => {
    if (!e) {
      return
    }
    if (type == "memo" && value == e.Memo) {
      return
    }
    let id = e.ItemID ? e.ItemID : e.ID
    dispatch(userActions.updateCollection(id, type, value))
  }

  return (
    <Modal
      title={Util.getName(e)}
      visible={modal.get('showModal')}
      onCancel={onCancel}
      footer={null}
    >
      <div>
        <Rate
          allowHalf allowClear
          value={getScore(e)}
          onChange={(val) => {sendUpdate("score", val * 2)}}
        />
        <br/><br/>
        <Checkbox.Group
          options={statusOptions}
          value={getStatus(e)}
          onChange={(options) => {sendUpdate("status", options)}}
        />
        <br/><br/>
        <TextArea
          placeholder="메모를 남겨주세요."
          autoSize={{minRows: 3}}
          value={memo}
          onChange={(e) => {setMemo(e.target.value)}}
          onBlur={(e) => {sendUpdate("memo", e.target.value)}}
        />
      </div>
    </Modal>
  )
}