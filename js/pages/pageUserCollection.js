import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import Axios from 'axios'
import UserCollection from '../user/userCollection'
import DisplayNotice from '../common/displayNotice'

export default function PageUserCollection() {
  let location = useLocation()

  const [err, setError] = useState("")
  const [nickname, setNickname] = useState("")
  const [collection, setCollection] = useState([])

  useEffect(() => {
    Axios.post(location.pathname)
    .then( res => {
      setNickname(res.data.nickname)
      setCollection(res.data.collection)
    })
    .catch( err => {
      if (err.response) {
        setError("에러: " + err.response.data.error)
      }
    }) 
  }, [])

  return (
    <div className="content py-4 px-3">
        <DisplayNotice content={err} />
        <h4>{nickname}님의 책장</h4>
        <UserCollection collection={collection} />
    </div>
  )
}