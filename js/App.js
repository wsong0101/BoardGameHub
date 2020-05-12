import React from 'react'
import { Route, Switch, useLocation, Link } from 'react-router-dom'
import './App.css'

import Main from './pages/Main'
import PageRegister from './pages/PageRegister'
import PageLogin from './pages/PageLogin'
import ItemCreate from './pages/ItemCreate'

export default function App(props) {
  let location = useLocation()

  function getLoginUri() {
    return "/login?url=" + encodeURIComponent(location.pathname)
  }

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-light">
        <Link className="navbar-brand mr-auto" to="/">BoardGameHub</Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to={getLoginUri()}>로그인</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register">회원가입</Link>
          </li>
        </ul>
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