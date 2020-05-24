import React, {useState, useEffect} from 'react'
import { useLocation, Link } from 'react-router-dom'
import Axios from 'axios'
import UserCollection from '../user/userCollection'
import DisplayNotice from '../common/displayNotice'
import { useAuth } from '../util/context'

export default function PageUserCollection() {
  let location = useLocation()

  const [err, setError] = useState("")
  const [updateErr, setUpdateErr] = useState("")
  const [status, setStatus] = useState("")
  const [nickname, setNickname] = useState("")
  const [counts, setCounts] = useState([])
  const [collection, setCollection] = useState([])

  const { userInfo } = useAuth();
  const isMe = (userInfo && nickname == userInfo.nickname)

  useEffect(() => {
    Axios.post(location.pathname + "/1")
    .then( res => {
      setNickname(res.data.nickname)
      setCounts(res.data.counts)
      setCollection(res.data.collection ? res.data.collection : [])
      setError("")
    })
    .catch( err => {
      if (err.response) {
        setError("에러: " + err.response.data.error)
      }
    }) 
  }, [status])

  let drawButton = (s, name, count) => {
    let current = location.pathname.split("/").reverse()[0]
    let active = (s == current) ? " active" : ""
    return (
      <li className="nav-item">
        <Link className={"nav-link"+active} to={"./"+s} onClick={() => {setStatus(s)}}>{name}{" ("+count+")"}</Link>
      </li>
    )
  }

  const drawNavigation = 
    <ul className="nav nav-pills nav-fill">
      {drawButton("own", "보유중", counts.Own)}
      {drawButton("prev_owned", "이전에 보유", counts.PrevOwned)}
      {drawButton("for_trade", "판매중", counts.ForTrade)}
      {drawButton("want", "갖고싶음", counts.Want)}
      {drawButton("want_to_buy", "구입희망", counts.WantToBuy)}
      {drawButton("wishlist", "위시리스트", counts.Wishlist)}
      {drawButton("preordered", "선주문", counts.Preordered)}
    </ul>

  let drawImportButton
  if (isMe) {
    drawImportButton  = <Link className="btn btn-warning ml-auto" to="/user/import">BGG Collection 가져오기</Link>
  }

  const updateCollection = (id, type, value) => {
    let form = new FormData
    form.append("value", value)

    Axios.put("/user/collection/"+id+"/"+type, form)
    .then( res => {
      let copy = [...collection]
      let found = copy.find(e => e.ID == id)

      switch (type) {
        case "score":
          found.Score = value
          break;
        case "own":
          found.Status.Own = found.Status.Own == 0 ? 1 : 0
          break;
        case "prev_owned":
          found.Status.PrevOwned = found.Status.PrevOwned == 0 ? 1 : 0
          break;
        case "for_trade":
          found.Status.ForTrade = found.Status.ForTrade == 0 ? 1 : 0
          break;
        case "want":
          found.Status.Want = found.Status.Want == 0 ? 1 : 0
          break;
        case "want_to_buy":
          found.Status.WantToBuy = found.Status.WantToBuy == 0 ? 1 : 0
          break;
        case "wishlist":
          found.Status.Wishlist = found.Status.Wishlist == 0 ? 1 : 0
          break;
        case "preordered":
          found.Status.Preordered = found.Status.Preordered == 0 ? 1 : 0
          break;
        case "memo":
          found.Memo = value
          break;
      }

      setCollection(copy)
      setUpdateErr("")
    })
    .catch( err => {
      if (err.response) {
        setUpdateErr("에러: " + err.response.data.error)
      }
    })
  }

  return (
    <div className="content py-4 px-3">
        <DisplayNotice content={err} />
        <h4 className="d-flex justify-content-between">
          {nickname}님의 책장
          {drawImportButton}
        </h4>
        <div className="pt-2">
          {drawNavigation}
          <UserCollection collection={collection} isMe={isMe} updateCollection={updateCollection} updateErr={updateErr}/>
        </div>
    </div>
  )
}