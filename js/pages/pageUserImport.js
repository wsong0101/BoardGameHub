import React, {useState} from 'react'
import {useLocation, useHistory} from 'react-router-dom'
import Axios from 'axios'
import Checker from '../util/InputChecker'
import InputText from '../input/InputText'
import DisplayNotice from '../common/displayNotice'

export default function UserImport() {
  let query = new URLSearchParams(useLocation().search)
  let history = useHistory()

  const [input, setInput] = useState([
    {
      "name": "inputGeekUsername",
      "value": "",
      "valid": false,
      "label": "BGG 유저 이름",
      "description": "BoardGameGeek에서 사용하는 유저이름을 입력합니다.",
      "checker": Checker.checkLength.bind(null, 2),
    },
  ])
  const [err, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])

  function handleChange(index, value, valid) {
    input[index].value = value
    input[index].valid = valid
    setInput(input)
    setError("")
  }

  function handleSubmit(e) {
    e.preventDefault()
    let form = new FormData

    for (let index in input) {
      let target = input[index]
      if (!target.valid) {
        setError("다음 항목이 올바르지 않습니다: " + target.label)
        return
      }
      form.append(target.name, target.value)
    }

    // do submit
    setIsLoading(true)
    Axios.post("/user/import", form)
    .then( res => {
      res.data.Items.sort((a, b) => {
        return b.IsExist
      })
      setItems(res.data.Items)
      setIsLoading(false)
    })
    .catch( err => {
      if (err.response) {
        setError("에러: " + err.response.data.error)
      }
    })
  }

  function drawItems() {
    let countDisplay
    if (items.length > 0) {
      countDisplay =  <li className="list-group-item" key="0">{items.length} 개의 아이템을 가져왔습니다.</li>
    }

    const listItems = items.map((item, index) =>
      <li className="list-group-item" key={index + 1}>
        <div className="container">
          <div className="row">
            <div className="col-sm-1">{index + 1}</div>
            <div className="col-sm-2"><img src={item.Thumbnail} className="img-thumbnail"/></div>
            <div className="col-sm-2">{item.Name}</div>
            <div className="col-sm-4">
              Own <span className="badge badge-secondary mr-2">{item.Status.Own}</span>
              PrevOwn <span className="badge badge-secondary mr-2">{item.Status.PrevOwned}</span>
              ForTrade <span className="badge badge-secondary mr-2">{item.Status.ForTrade}</span>
              Want <span className="badge badge-secondary mr-2">{item.Status.Want}</span>
              WantToBuy <span className="badge badge-secondary mr-2">{item.Status.WantToBuy}</span>
              Wishlist <span className="badge badge-secondary mr-2">{item.Status.Wishlist}</span>
              Preordered <span className="badge badge-secondary mr-2">{item.Status.Preordered}</span>
            </div>
            <div className="col-sm-3">
              <div className="mb-1">아직 허브의 DB에 없는 아이템입니다.</div>
              <button type="button" className="btn btn-primary">DB에 추가</button>
            </div>
          </div>
        </div>
      </li>
    )
    return (
    <ul className="list-group mt-3">
      {countDisplay}
      {listItems}
    </ul>
    )
  }

  function drawImportButton() {
    let spinner =
    <div className="spinner-border text-success" role="status">
      <span className="sr-only">Loading...</span>
    </div>
    let button = <button type="submit" className="btn btn-primary">가져오기</button>

    if (isLoading) {
      return spinner
    } else {
      return button
    }
  }

  return (
    <div className="content py-4 px-3">
      <form onSubmit={handleSubmit}>
        <h4>Collection 가져오기</h4>
        <hr/>
        <div className="alert alert-warning">※ 주의: 가져오기를 실행하면 현재 컬렉션이 덮어씌워집니다.</div>
        <DisplayNotice content={err} />
        <InputText info={input[0]} onChange={handleChange.bind(null, 0)} />
        {drawImportButton()}
      </form>
      {drawItems()}
    </div>
  )
}