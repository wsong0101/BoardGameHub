import React, {useState, useEffect} from 'react'
import { Route, Switch, useLocation, Link } from 'react-router-dom'
import './App.css'

import {AuthContext} from './util/context'
import LoginRoute from './loginRoute'
import Main from './pages/Main'
import PageRegister from './pages/PageRegister'
import PageLogin from './pages/PageLogin'
import PageUserImport from './pages/pageUserImport'
import PageUserCollection from './pages/pageUserCollection'
import PageItemInfo from './pages/pageItemInfo'
import ItemCreate from './pages/ItemCreate'
import Axios from 'axios'

export default function App(props) {
  let location = useLocation()
  
  let existingUserInfo = (sessionStorage.userInfo != undefined && sessionStorage.userInfo != "undefined") ?
    JSON.parse(sessionStorage.userInfo) : undefined
  const [userInfo, setUserInfo] = useState(existingUserInfo)

  const appSetUserInfo = (data) => {
    sessionStorage.setItem("userInfo", JSON.stringify(data))
    setUserInfo(data)
  }

  function isLoggedIn() {
    return userInfo !== undefined
  }

  function getLoginUri() {
    return "/login?url=" + encodeURIComponent(location.pathname)
  }

  function loadSessionUser() {
    Axios.post("/session/user")
    .then(res => {
      appSetUserInfo(res.data)
    })
    .catch(err => {
      console.log(err.response)
    })
  }

  function sendLogout() {
    Axios.post("/logout")
    .then(res => {
      appSetUserInfo()
    })
    .catch(err => {
      console.log(err.response)
    })
  } 

  function displayLoginStatus() {
    if (isLoggedIn()) {
      return (
        <ul className="navbar-nav">
          <li className="nav-item">
            <div className="dropdown">
              <a className="nav-link dropdown-toggle hand" id="userMenuButton" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                  Welcome! {userInfo.nickname}
              </a>
              <div className="dropdown-menu" aria-labelledby="userMenuButton">
                <Link className="dropdown-item" to={"/user/collection/" + userInfo.id + "/own"}>내 책장</Link>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link hand" onClick={sendLogout}>로그아웃</a>
          </li>
      </ul>
      )
    }    
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
    <div className="container">
      <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-light">
        <Link className="navbar-brand mr-auto" to="/">BoardGameHub</Link>
        {displayLoginStatus()}
      </nav>
      <div className="mt-2">
        <AuthContext.Provider value={{ userInfo, setUserInfo: appSetUserInfo}}>
          <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/register" component={PageRegister} />
              <Route exact path="/login" component={PageLogin} />
              <Route path="/user/collection/:id" component={PageUserCollection} />
              <Route path="/item/:id" component={PageItemInfo} />
              <LoginRoute exact path="/user/import" component={PageUserImport} />
              <LoginRoute exact path="/item/create" component={ItemCreate} />
          </Switch>
        </AuthContext.Provider>
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