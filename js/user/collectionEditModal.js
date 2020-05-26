import React, {useState, useEffect} from 'react'
import DisplayNotice from '../common/displayNotice'
import Util from '../util/util'

export default function CollectionEditModal(props) {
  const [memo, setMemo] = useState("")

  let select = props.collection

  useEffect(() => {
    setMemo(select.Memo)
  }, [select])


  const sendUpdate = (e, type) => {
    if (type == "memo") {
      if (e.target.value == select.Memo) {
        return
      }
    }
    let targetID = select.ItemID ? select.ItemID : select.ID
    props.updateCollection(targetID, type, e.target.value)
  }

  const updateMemo = (e) => {
    setMemo(e.target.value)
  }
  
  const isChecked = (type) => {
    let isSelected = false
    switch (type) {
      case "own":
        isSelected = select.Own == 1
        break
      case "prev_owned":
        isSelected = select.PrevOwned == 1
        break
      case "for_trade":
        isSelected = select.ForTrade == 1
        break
      case "want":
        isSelected = select.Want == 1
        break
      case "want_to_buy":
        isSelected = select.WantToBuy == 1
        break
      case "wishlist":
        isSelected = select.Wishlist == 1
        break
      case "preordered":
        isSelected = select.Preordered == 1
        break
    }

    return isSelected ? "checked" : ""
  }

  return (
    <div className="modal editModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{Util.getName(select)}</h5>
          </div>
          <div className="modal-body">
            <DisplayNotice content={props.updateErr} />
            <form>
              <div className="form-group">
                <label htmlFor="myScore">내 점수</label>
                <select className="form-control" id="myScore" value={select.Score} onChange={(e) => {sendUpdate(e, "score")}}>
                  <option value="0">없음</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="checkbox" id="own" value="own"
                    checked={isChecked("own")} onChange={(e) => {sendUpdate(e, "own")}}/>
                  <label className="form-check-label" htmlFor="own">보유중</label>
                  <input className="form-check-input ml-3" type="checkbox" id="prev_owned" value="prev_owned"
                    checked={isChecked("prev_owned")} onChange={(e) => {sendUpdate(e, "prev_owned")}} />
                  <label className="form-check-label" htmlFor="prev_owned">이전에 보유</label>
                  <input className="form-check-input ml-3" type="checkbox" id="for_trade" value="for_trade"
                    checked={isChecked("for_trade")} onChange={(e) => {sendUpdate(e, "for_trade")}} />
                  <label className="form-check-label" htmlFor="for_trade">판매중</label>
                  <input className="form-check-input ml-3" type="checkbox" id="want" value="want"
                    checked={isChecked("want")} onChange={(e) => {sendUpdate(e, "want")}} />
                  <label className="form-check-label" htmlFor="want">갖고싶음</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="checkbox" id="want_to_buy" value="want_to_buy"
                    checked={isChecked("want_to_buy")} onChange={(e) => {sendUpdate(e, "want_to_buy")}} />
                  <label className="form-check-label" htmlFor="want_to_buy">구입희망</label>
                  <input className="form-check-input ml-3" type="checkbox" id="wishlist" value="wishlist"
                    checked={isChecked("wishlist")} onChange={(e) => {sendUpdate(e, "wishlist")}} />
                  <label className="form-check-label" htmlFor="wishlist">위시리스트</label>
                  <input className="form-check-input ml-3" type="checkbox" id="preordered" value="preordered"
                    checked={isChecked("preordered")} onChange={(e) => {sendUpdate(e, "preordered")}} />
                  <label className="form-check-label" htmlFor="preordered">선주문</label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="memo">메모</label>
                <textarea className="form-control" id="memo" rows="3" onBlur={(e) => {sendUpdate(e, "memo")}}
                  onChange={updateMemo} value={memo}></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-dismiss="modal">닫기</button>
          </div>
        </div>
      </div>
    </div>
  )
}