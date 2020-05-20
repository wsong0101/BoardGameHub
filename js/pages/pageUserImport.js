import React, {useState} from 'react'
import Axios from 'axios'
import Checker from '../util/InputChecker'
import InputText from '../input/InputText'
import DisplayNotice from '../common/displayNotice'

export default function UserImport() {
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
  const [collections, setCollections] = useState([])

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

    setIsLoading(true)
    Axios.post("/user/import", form)
    .then(res => {
      res.data.sort((a, b) => {
        if (a.IsExistInDB == b.IsExistInDB) {
          return 0
        }
        if (a.IsExistInDB) {
          return 1
        }
        return -1
      })
      setCollections(res.data)
      setIsLoading(false)
    })
    .catch( err => {
      if (err.response) {
        setError("에러: " + err.response.data.error)
      }
    })
  }

  function sendItemImport(geekId) {
    setIsLoading(true)

    let form = new FormData
    form.append("geekId", geekId)

    Axios.post("/item/import", form)
    .then(res => {
      let found = collections.find(e => e.ID == geekId)
      found.IsExistInDB = true
      setCollections(collections)
      setIsLoading(false)
    })
    .catch(err => {
      if (err.response) {
        setError("에러: " + err.response.data.error)
      }
      setIsLoading(false)
    })
  }

  let spinner =
    <div className="spinner-border text-success" role="status">
      <span className="sr-only">Loading...</span>
    </div>

  function drawItems() {
    let countDisplay
    if (collections.length > 0) {
      countDisplay =  <li className="list-group-item" key="0">{collections.length} 개의 아이템을 가져왔습니다.</li>
    }

    function drawButton(geekId, isExist) {
      if (isLoading) {
        return spinner
      }

      if (isExist) {
        return (
          <h3 className="text-success"><i className="fas fa-check"></i></h3>
        )
      }

      return (
        <div>        
          <div className="mb-1">아직 허브의 DB에 없는 아이템입니다.</div>
          <button type="button" className="btn btn-primary" onClick={() => {sendItemImport(geekId)}}>DB에 추가</button>
        </div>
      )
    }

    function drawStatus(status) {
      let buttons = []
      if (status.Own > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="0">Own</button>)
      } else if (status.PrevOwned > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="1">PrevOwned</button>)
      } else if (status.ForTrade > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="2">ForTrade</button>)
      } else if (status.Want > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="3">Want</button>)
      } else if (status.WantToBuy > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="4">WantToBuy</button>)
      } else if (status.Wishlist > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="5">Wishlist</button>)
      } else if (status.Preordered > 0) {
        buttons.push(<button type="button" className="btn btn-secondary mr-1 mt-1" key="6">Preordered</button>)
      }
      return buttons
    }

    const listItems = collections.map((col, index) =>
      <li className="list-group-item" key={index + 1}>
        <div className="container">
          <div className="row">
            <div className="col-sm-1">{index + 1}</div>
            <div className="col-sm-2"><img src={col.Thumbnail} className="img-thumbnail"/></div>
            <div className="col-sm-2">{col.PrimaryName}</div>
            <div className="col-sm-4">
              {drawStatus(col.Status)}
            </div>
            <div className="col-sm-3">{drawButton(col.ID, col.IsExistInDB)}</div>
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

  let button = <button type="submit" className="btn btn-primary">가져오기</button>
  if (isLoading) {
    button = spinner
  }

  return (
    <div className="content py-4 px-3">
      <form onSubmit={handleSubmit}>
        <h4>Collection 가져오기</h4>
        <hr/>
        <div className="alert alert-warning">※ 주의: 가져오기를 실행하면 현재 컬렉션이 덮어씌워집니다.</div>
        <DisplayNotice content={err} />
        <InputText info={input[0]} onChange={handleChange.bind(null, 0)} />
        {button}
      </form>
      {drawItems()}
    </div>
  )
}