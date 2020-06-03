import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { itemActions } from '../action'

import { Util } from '../util'

import { Modal, Rate, Checkbox, Input } from 'antd'
import { RootState } from '../reducer'
import { ICollection, ICollectionUpdate } from '../common'
const { TextArea } = Input;

export default function CollectionEditModal() {
  const dispatch = useDispatch()
  const modal = useSelector((state: RootState) => state.modal)
  const [memo, setMemo] = useState("")
  
  useEffect(() => {
    setMemo(getMemo(modal.collection))
  }, [modal])

  function onCancel() {
    dispatch(itemActions.hideModal())
  }

  function getScore(col: ICollection) {
    if (!col || !col.Score) {
      return 0.0
    }
    return col.Score / 2
  }

  function getMemo(col: ICollection) {
    if (!col || !col.Memo) {
      return ""
    }
    return col.Memo
  }

  function getStatus(col: ICollection) {
    if (!col) {
      return []
    }
    return col.Status
  }


  const statusOptions = [
    { label: '보유중', value: 'own'},
    { label: '이전에 보유', value: 'prev_owned'},
    { label: '판매중', value: 'for_trade'},
    { label: '갖고싶음', value: 'want'},
    { label: '구매중', value: 'want_to_buy'},
    { label: '위시리스트', value: 'wishlist'},
    { label: '사전주문', value: 'preordered'},
  ]

  const sendUpdate = (type: string, value: any) => {
    if (type == "memo" && value == modal.collection.Memo) {
      return
    }
    let id = modal.collection.ItemID ? modal.collection.ItemID : modal.collection.ID
    const update: ICollectionUpdate = {
      ID: id ,
      Type: type,     
    }
    switch (type) {
      case "score":
        update.Score = value
        break
      case "memo":
        update.Memo = value
        break
      case "status":
        update.Status = value
        break
    }
    dispatch(itemActions.updateCollection(update))
  }

  return (
    <Modal
      title={Util.getName(modal.collection)}
      visible={modal.showModal}
      onCancel={onCancel}
      footer={null}
    >
      <div>
        <Rate
          allowHalf allowClear
          value={getScore(modal.collection)}
          onChange={(val) => {sendUpdate("score", val * 2)}}
        />
        <br/><br/>
        <Checkbox.Group
          options={statusOptions}
          value={getStatus(modal.collection)}
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