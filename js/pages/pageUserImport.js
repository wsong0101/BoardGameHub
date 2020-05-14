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
    Axios.post("/user/import", form)
    .then( res => {
      console.log(res)
    })
    .catch( err => {
      if (err.response) {
        setError("에러: " + err.response.data.error)
      }
    })
  }

  return (
    <div className="content py-4 px-3">
      <form onSubmit={handleSubmit}>
        <h4>Collection 가져오기</h4>
        <hr/>
        <DisplayNotice content={err} />
        <InputText info={input[0]} onChange={handleChange.bind(null, 0)} />
        <button type="submit" className="btn btn-primary">가져오기</button>
      </form>
    </div>
  )
}