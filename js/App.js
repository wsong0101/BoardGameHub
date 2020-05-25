import React, {useState, useEffect} from 'react'
import { Route, Switch, Redirect, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {AuthContext} from './util/context'
import LoginRoute from './loginRoute'
import Main from './page/Main'
import PageRegister from './page/PageRegister'
import PageLogin from './page/PageLogin'
import PageUserImport from './page/pageUserImport'
import PageUserCollection from './page/pageUserCollection'
import PageItemInfo from './page/pageItemInfo'
import ItemCreate from './page/ItemCreate'
import Axios from 'axios'

import { history } from './helper'
import { alertActions } from './action'
import { LoginPage } from './component'

import './App.css'

import {Layout, Menu, Breadcrumb} from 'antd'
import 'antd/dist/antd.css';
const {Header, Content, Footer} = Layout

export default function App(props) {
  const location = useLocation()
  const alert = useSelector(state => state.alert)
  const dispatch = useDispatch()

  useEffect(() => {
    history.listen((location, action) => {
        // clear alert on location change
        dispatch(alertActions.clear())
    })
  }, [])

  const getLoginUri = () => {
    return "/login?url=" + encodeURIComponent(location.pathname)
  }

  return (
    <Layout>
      <Header style={{position:'fixed', zIndex:1, width:'100%'}} >
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Menu 1</Menu.Item>
          <Menu.Item key="login" style={{float: 'right'}}>
            <Link to="/register">회원가입</Link></Menu.Item>
          <Menu.Item key="register" style={{float: 'right'}}>
            <Link to={getLoginUri()}>로그인</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        {alert.message &&
                        <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/register" component={PageRegister} />
            <Route exact path="/login" component={LoginPage} />
            <Route path="/user/collection/:id" component={PageUserCollection} />
            <Route path="/item/:id" component={PageItemInfo} />
            <LoginRoute exact path="/user/import" component={PageUserImport} />
            <LoginRoute exact path="/item/create" component={ItemCreate} />
            <Redirect from="*" to="/" />
          </Switch>
        </div>      
      </Content>
      <Footer style={{ textAlign: 'center' }}>BoardGameHub ©2020 Created by WSong</Footer>
    </Layout>

    // <div className="container">
    //   <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-light">
    //     <Link className="navbar-brand mr-auto" to="/">BoardGameHub</Link>
    //     {displayLoginStatus()}
    //   </nav>
    //   <div className="mt-2">
    //     <AuthContext.Provider value={{ userInfo, setUserInfo: appSetUserInfo}}>
    //       <Switch>
    //           <Route exact path="/" component={Main} />
    //           <Route exact path="/register" component={PageRegister} />
    //           <Route exact path="/login" component={PageLogin} />
    //           <Route path="/user/collection/:id" component={PageUserCollection} />
    //           <Route path="/item/:id" component={PageItemInfo} />
    //           <LoginRoute exact path="/user/import" component={PageUserImport} />
    //           <LoginRoute exact path="/item/create" component={ItemCreate} />
    //       </Switch>
    //     </AuthContext.Provider>
    //   </div>

    //   <div className="modal" tabIndex="-1" role="dialog">
    //     <div className="modal-dialog" role="document">
    //       <div className="modal-content">
    //         <div className="modal-header">
    //           <h5 className="modal-title">title here</h5>
    //         </div>
    //         <div className="modal-body">
    //           <p>body here</p>
    //         </div>
    //         <div className="modal-footer">
    //           <button type="button" className="btn btn-primary" data-dismiss="modal">확인</button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    // </div>
  )
}