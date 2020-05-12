import React from 'react'
import Axios from 'axios'
import Checker from '../util/InputChecker'
import InputText from '../input/InputText'
import DisplayNotice from '../common/displayNotice'

export default class PageRegister extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      input: [
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
          "description": "다른 사람들에게 표시될 이름으로 4자 이상이 되야합니다.",
          "checker": Checker.checkLength.bind(null, 4),
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
      ],
      err: "",
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  getValidClass(name) {
    if (this.state && this.state[name] && this.state[name].valid) {
      return "is-valid"
    }
    return "is-invalid"
  }

  handleChange(index, value, valid) {
    let input = this.state.input
    input[index].value = value
    input[index].valid = valid
    this.setState({
      input: input,
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    let form = new FormData

    for (let index in this.state.input) {
      let input = this.state.input[index]
      if (!input.valid) {
        this.setState({
          err: "다음 항목이 올바르지 않습니다: " + input.label
        })
        return
      }
      form.append(input.name, input.value)
    }

    if (this.state.input[2].value != this.state.input[3].value) {      
      this.setState({
        err: "비밀번호와 비밀번호 재입력이 일치해야 합니다."
      })
      return
    }

    // do submit

  }

  render() {
    return (
      <div className="content py-4 px-3">
        <form onSubmit={this.handleSubmit}>
          <h4>회원가입</h4>
          <hr/>
          <DisplayNotice content={this.state.err} />
          <InputText info={this.state.input[0]} onChange={this.handleChange.bind(null, 0)} />
          <InputText info={this.state.input[1]} onChange={this.handleChange.bind(null, 1)} />
          <InputText info={this.state.input[2]} onChange={this.handleChange.bind(null, 2)} type="password" />
          <InputText info={this.state.input[3]} onChange={this.handleChange.bind(null, 3)} type="password" />
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    )
  }
}