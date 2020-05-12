import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import Axios from 'axios'
import Checker from '../util/InputChecker'
import InputText from '../input/InputText'
import DisplayNotice from '../common/displayNotice'
import Popup from '../util/popup'

export default function PageRegister() {
  let history = useHistory()

  const [input, setInput] = useState([
    {
      "name": "inputEmail",
      "value": "",
      "valid": false,
      "label": "이메일 주소",
      "description": "실제 존재하는 이메일 주소를 적어주셔야 합니다. 인증 수단으로 사용됩니다.",
      "checker": Checker.checkEmail,
      "placeholder": "name@example.com",
    },
    {
      "name": "inputNickname",
      "value": "",
      "valid": false,
      "label": "닉네임",
      "description": "다른 사람들에게 표시될 이름으로 3자 이상이 되야합니다.",
      "checker": Checker.checkLength.bind(null, 3),
    },
    {
      "name": "inputPassword",
      "value": "",
      "valid": false,
      "label": "비밀번호",
      "description": "비밀번호는 8자 이상 되어야 합니다.",
      "checker": Checker.checkLength.bind(null, 8),
    },
    {
      "name": "inputPasswordRe",
      "value": "",
      "valid": false,
      "label": "비밀번호 재입력",
      "description": "위에 입력한 비빌번호와 동일하게 입력합니다.",
      "checker": Checker.checkLength.bind(null, 8),
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

    if (input[2].value !=input[3].value) {      
      setError("비밀번호와 비밀번호 재입력이 일치해야 합니다.")
      return
    }

    Axios.post("/register", form)
    .then( res => {
      Popup.show("회원가입 완료",
        "축하합니다! 회원가입을 마무리하기 위해 이메일 인증이 필요합니다.",
        () => {
          history.push("/")
        })
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
        <h4>회원가입</h4>
        <hr/>
        <DisplayNotice content={err} />
        <InputText info={input[0]} onChange={handleChange.bind(null, 0)} />
        <InputText info={input[1]} onChange={handleChange.bind(null, 1)} />
        <InputText info={input[2]} onChange={handleChange.bind(null, 2)} type="password" />
        <InputText info={input[3]} onChange={handleChange.bind(null, 3)} type="password" />
        <button type="submit" className="btn btn-primary">가입</button>
      </form>
    </div>
  )
}