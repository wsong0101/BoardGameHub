import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import DisplayNotice from '../common/displayNotice'
import Util from '../util/util'
import Axios from 'axios'
import './UserCollection.css'

export default function UserCollection(props) {
  const [select, setSelect] = useState({})
  const [memo, setMemo] = useState("")

  const sendUpdate = (e, type) => {
    if (type == "memo") {
      if (e.target.value == select.Memo) {
        return
      }
    }
    props.updateCollection(select.ID, type, e.target.value)
  }

  const updateMemo = (e) => {
    setMemo(e.target.value)
  }

  const showStars = (score) => {
    let stars = []
    
    let i = 0
    for (; i < Math.floor(score / 2); ++i) {
      stars.push(
        <i key={i} className="fas fa-star text-warning"></i>
      )
    }

    if (score % 2 == 1) {
      stars.push(
        <i key={i} className="fas fa-star-half text-warning"></i>
      )
    }

    return (
      stars
    )
  }

  const showDetailModal = (ID) => {
    Axios.post("/item/info/"+ID)
    .then( res => {
      console.log(res.data)      
      setSelect(res.data)
    })
    .catch( err => {
      console.log(err.response)
    })

    $('.detailModal').modal('show')
  }

  const showEditModal = (elem) => {
    setSelect(elem)
    setMemo(elem.Memo)
    $('.editModal').modal('show')
  }

  const showCog = (elem) => {
    if (props.isMe) {
      return (
        <i className="fas fa-cog text-info hand" onClick={() => {showEditModal(elem)}}></i>
      )
    }
  }

  const drawlistItems = () => {
    return (
        props.collection.map((elem, index) =>
        <div className="col-6 col-sm-4 col-md-3 col-lg-2 px-1 py-2" key={index + 1}>
          <div className="h-100 border rounded d-flex flex-column justify-content-center">
            <div className="card-img-div flex-grow-1 d-flex flex-column justify-content-center p-1">
              <Link to={"/item/info/"+elem.ID} className="card-img">
                <img src={elem.Thumbnail} className="card-img rounded-top"/>
              </Link>
            </div>
            <div className="p-2 flex-grow-0">
              <div className="star">
                <span className="mr-2 text-warning">{elem.Score}</span>
                {showStars(elem.Score)}
              </div>
              <div className="pt-2 d-flex justify-content-between">
                {Util.getName(elem)}
                {showCog(elem)}
              </div>
            </div>
          </div>
        </div>
      )
    )
  }

  const detailModal = (
    <div className="modal detailModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{Util.getName(select)}</h5>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col">
                <div><i className="fas fa-users"></i> {select.MinPlayers} ~ {select.MaxPlayers}인</div>
              </div>
              <div className="col">
                <i className="far fa-clock"></i> {select.MinPlayingTime} ~ {select.MaxPlayingTime}분
              </div>
            </div>
            <div className="row mt-1">
              <div className="col">
                <div><i className="far fa-thumbs-up"></i> 베스트: {select.BestNumPlayers}인</div>
              </div>
              <div className="col">
                <div><i className="far fa-smile"></i> 추천: {select.RecommendNumPlayers}인</div>
              </div>
              <div className="col">
                <div><i className="far fa-thumbs-down"></i> 비추천: {select.NotRecommendedNumPlayers}인</div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-dismiss="modal">닫기</button>
          </div>
        </div>
      </div>
    </div>
  )

  const isChecked = (type) => {
    if (!select.Status) {
      return ""
    }

    let isSelected = false
    switch (type) {
      case "own":
        isSelected = select.Status.Own == 1
        break
      case "prev_owned":
        isSelected = select.Status.PrevOwned == 1
        break
      case "for_trade":
        isSelected = select.Status.ForTrade == 1
        break
      case "want":
        isSelected = select.Status.Want == 1
        break
      case "want_to_buy":
        isSelected = select.Status.WantToBuy == 1
        break
      case "wishlist":
        isSelected = select.Status.Wishlist == 1
        break
      case "preordered":
        isSelected = select.Status.PreOrdered == 1
        break
    }

    return isSelected ? "checked" : ""
  }

  const editModal = (
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

  return (
    <div className="row pt-2">
        {drawlistItems()}
        {editModal}
    </div>
  )
}