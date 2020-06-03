import React, {useEffect} from 'react'
import { Route, Switch, Redirect, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { history } from './helper'
import { alertActions, userActions } from './action'
import {
  LoginRoute, AdminRoute, LoginPage, RegisterPage, RegisterWelcomePage, CollectionPage, ItemInfoPage, MainPage,
  ImportPage, ProposePage, AdminPage, TagInfoPage,
} from './component'

import './App.css'

import { Layout, Menu, Breadcrumb, Alert, Dropdown, PageHeader } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { RootState } from './reducer';
const { Header, Content, Footer } = Layout

export default function App() {
  const location = useLocation()
  const dispatch = useDispatch()
  
  const alert = useSelector((state: RootState) => state.alert)
  const auth = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    history.listen((location, action) => {
        // clear alert on location change
        dispatch(alertActions.clear())
    })
  }, [])

  const getLoginUri = () => {
    return "/login?url=" + encodeURIComponent(location.pathname)
  }

  type alertType = 'success' | 'info' | 'warning' | 'error'
  const drawAlert = () => {
    if (alert.Message) {
      return (
        <Alert message={alert.Message} type={alert.Type as alertType} showIcon />
      )
    }
  }

  const drawLoginMenu = () => {
    if (!auth.loggedIn) {
      return (
        <Menu.Item key="login" style={{float: 'right'}}>
          <Link to={getLoginUri()}>로그인</Link>
        </Menu.Item>
      )
    }
  }

  const getMyBookshelfUrl = () => {
    if (!auth.loggedIn) {
      return '#'
    }
    return `/user/collection/${auth.user.ID}/own/1`
  }

  const onLogout = () => {
    dispatch(userActions.logout())
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="bookshelf">
        <Link to={getMyBookshelfUrl()}>내 책장</Link>
      </Menu.Item>
      <Menu.Item key="import">
        <Link to="/user/import">Geek에서 가져오기(임시)</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <a onClick={onLogout}>로그아웃</a>
      </Menu.Item>
    </Menu>
  )

  const drawUserInfo = () => {
    if (auth.loggedIn) {
      return (
        <Menu.Item key="user-info" style={{float: 'right'}}>
          <Dropdown overlay={userMenu} trigger={['click']} >
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              {auth.user.Nickname} <DownOutlined />
            </a>
          </Dropdown>
        </Menu.Item>

      )
    }
  }

  const drawPageHeader = () => {
    return (
      <PageHeader
        className="site-page-header"
        title="Title"
      />
    )
  }

  return (
    <Layout>
      <Header style={{position:'fixed', zIndex:1, width:'100%'}} >
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to='/' >Menu 1</Link>
          </Menu.Item>
          {drawLoginMenu()}
          {drawUserInfo()}
        </Menu>
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        {drawAlert()}
        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
          {drawPageHeader()}
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/register/welcome" component={RegisterWelcomePage} />
            <Route exact path="/login" component={LoginPage} />

            <Route exact path="/user/collection/:id/:category/:page" component={CollectionPage} />
            <Route exact path="/item/info/:id" component={ItemInfoPage} />
            <LoginRoute exact path="/user/import" component={ImportPage} />
            <LoginRoute exact path="/propose" component={ProposePage} />
            <Route exact path="/tag/info/:id" component={TagInfoPage} />

            <AdminRoute exact path="/admin" component={AdminPage} />

            <Redirect from="*" to="/" />
          </Switch>
        </div>      
      </Content>
      <Footer style={{ textAlign: 'center' }}>BoardGameHub ©2020 Created by WSong</Footer>
    </Layout>
  )
}