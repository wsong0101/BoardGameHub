import React from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'

import Main from './pages/Main'
import PageRegister from './pages/PageRegister'
import ItemCreate from './pages/ItemCreate'

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  getLoginUri() {
    return "/login?url=" + encodeURIComponent(location.href)
  }

  render() {
    return (
      <div className="container">
        <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-light">
          <a className="navbar-brand mr-auto" href="#">Sticky top</a>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href={this.getLoginUri()}>로그인</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/register">회원가입</a>
            </li>
          </ul>
        </nav>
        <div className="mt-2">
          <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/register" component={PageRegister} />
              <Route exact path="/login" component={Main} />
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
}