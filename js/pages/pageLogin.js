import React, {useState} from 'react'
import {useLocation, useHistory} from 'react-router-dom'
import Axios from 'axios'
import Checker from '../util/InputChecker'
import InputText from '../input/InputText'
import DisplayNotice from '../common/displayNotice'

export default function PageLogin(props) {
  let query = new URLSearchParams(useLocation().search)
  let history = useHistory()

  const [input, setInput] = useState([
    {
      "name": "inputEmail",
      "value": "",
      "valid": false,
      "label": "이메일 주소",
      "description": "가입할 때 사용했던 이메일주소입니다.",
      "checker": Checker.checkEmail,
      "placeholder": "name@example.com",
    },
    {
      "name": "inputPassword",
      "value": "",
      "valid": false,
      "label": "비밀번호",
      "description": "가입할 때 사용했던 비밀번호입니다.",
      "checker": Checker.checkLength.bind(null, 1),
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
    Axios.post("/login", form)
    .then( res => {
      history.push(query.get("url"))
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
        <h4>로그인</h4>
        <hr/>
        <DisplayNotice content={err} />
        <InputText info={input[0]} onChange={handleChange.bind(null, 0)} />
        <InputText info={input[1]} onChange={handleChange.bind(null, 1)} type="password" />
        <button type="submit" className="btn btn-primary">로그인</button>
      </form>
    </div>
  )
}