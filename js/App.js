import React, {useState, useEffect} from 'react'
import { Route, Switch, useLocation, Link } from 'react-router-dom'
import './App.css'

import Main from './pages/Main'
import PageRegister from './pages/PageRegister'
import PageLogin from './pages/PageLogin'
import ItemCreate from './pages/ItemCreate'
import Axios from 'axios'

export default function App(props) {
  let location = useLocation()
  
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    loadSessionUser()
  })

  function getLoginUri() {
    return "/login?url=" + encodeURIComponent(location.pathname)
  }

  function loadSessionUser() {
    Axios.post("/session/user")
    .then(res => {
      setNickname(res.data.nickname)
      setEmail(res.data.email)
    })
    .catch(err => {
      console.log(err.response)
    })
  }

  function sendLogout() {
    Axios.post("/logout")
    .then(res => {
      setNickname("")
      setEmail("")
    })
    .catch(err => {
      console.log(err.response)
    })
  } 

  function displayLoginStatus() {
    if (email == "") {
      return (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to={getLoginUri()}>로그인</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register">회원가입</Link>
          </li>
        </ul>
      )
    }
    return (
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link">Welcome! {nickname}</a>
        </li>
        <li className="nav-item">
          <a className="nav-link hand" onClick={sendLogout}>로그아웃</a>
        </li>
    </ul>
    )
  }

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-light">
        <Link className="navbar-brand mr-auto" to="/">BoardGameHub</Link>
        {displayLoginStatus()}
      </nav>
      <div className="mt-2">
        <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/register" component={PageRegister} />
            <Route exact path="/login" component={PageLogin} />
            <Route exact path="/item/create" component={ItemCreate} />
        </Switch>
      </div>

      <div className="modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">title here</h5>
            </div>
            <div className="modal-body">
              <p>body here</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" data-dismiss="modal">확인</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}