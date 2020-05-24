import React, {useState, useEffect} from 'react'
import { useLocation, Link } from 'react-router-dom'
import Axios from 'axios'
import DisplayNotice from '../common/displayNotice'
import { useAuth } from '../util/context'
import Util from '../util/util'
import './PageItemInfo.css'

export default function PageItemInfo() {
  let location = useLocation()

  const [err, setError] = useState("")
  const [info, setInfo] = useState({})

  const { userInfo } = useAuth();

  useEffect(() => {
    Axios.post(location.pathname)
    .then( res => {
      console.log(res.data)
      setInfo(res.data)
      setError("")
    })
    .catch( err => {
      if (err.response) {
        setError("에러: " + err.response.data.error)
      }
    }) 
  }, [])

  const drawTags = (type) => {
    if (!info.Tags) {
      return
    }
    let tags = info.Tags.filter(t => t.TagType == type)
    let results = []

    let index = 0
    for(let tag of tags) {
      if (index != 0) {
        results.push(
          <span key={tag.ID}>, {Util.getName(tag)}</span>
        )
      } else {
        results.push(
          <span key={tag.ID}>{Util.getName(tag)}</span>
        )
      }
      ++index
    }

    return (
      results
    )
  }

  const drawBadges = (type, color) => {
    if (!info.Tags) {
      return
    }
    let tags = info.Tags.filter(t => t.TagType == type)
    let results = []

    for(let tag of tags) {
      results.push(
        <a key={tag.ID} className={"btn px-2 py-1 mr-2 mt-2" + " btn-outline-" + color}>{Util.getName(tag)}</a>
      )
    }

    return (
      results
    )
  }

  const getOriginURL = (url) => {
    if (url == undefined) {
      return ""
    }
    return url.replace('/300/', '/origin/')
  }

  return (
    <div className="content py-4 px-3">
        <DisplayNotice content={err} />
        <div className="row">
          <div className="col-4"><img src={getOriginURL(info.Thumbnail)} className="info-img"/></div>
          <div className="col-8">
            <h4><b>{Util.getName(info)}</b></h4>
            <hr/>
            <div className="row">
              <div className="col-6 col-md-4 py-1">
                <i className="fas fa-users"></i> {info.MinPlayers} ~ {info.MaxPlayers}인
              </div>
              <div className="col-6 col-md-4 py-1">
                <i className="far fa-clock"></i> {info.MinPlayingTime} ~ {info.MaxPlayingTime}분
              </div>
              <div className="col-6 col-md-4 py-1">
                <i className="far fa-clock"></i> {info.MinAge}세 이용가
              </div>
              <div className="col-6 col-md-4 py-1">
                <i className="far fa-thumbs-up"></i> 베스트: {info.BestNumPlayers}인
              </div>
              <div className="col-6 col-md-4 py-1">
                <i className="far fa-smile"></i> 추천: {info.RecommendNumPlayers}인
              </div>
              <div className="col-6 col-md-4 py-1">
                <i className="far fa-thumbs-down"></i> 비추천: {info.NotRecommendedNumPlayers}인
              </div>
            </div>
            <hr/>
            <div><i className="fas fa-user"></i> 디자이너: {drawTags(3)}</div>
            <div><i className="fas fa-palette mt-2"></i> 아티스트: {drawTags(4)}</div>
            <hr/>
            <div>{drawBadges(1, "success")}</div>
            <div>{drawBadges(2, "info")}</div>
          </div>          
        </div>
    </div>
  )
}