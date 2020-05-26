import React, {useState, useEffect} from 'react'
import { Route, Switch, Redirect, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import LoginRoute from './loginRoute'
import Main from './page/Main'
import PageUserImport from './page/pageUserImport'
import PageItemInfo from './page/pageItemInfo'
import ItemCreate from './page/ItemCreate'

import { history } from './helper'
import { alertActions, userActions } from './action'
import { LoginPage, RegisterPage, RegisterWelcomePage, CollectionPage } from './component'

import './App.css'

import { Layout, Menu, Breadcrumb, Alert, Dropdown, PageHeader } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
const { Header, Content, Footer } = Layout

export default function App(props) {
  const location = useLocation()
  const alert = useSelector(state => state.get('alert'))
  const auth = useSelector(state => state.get('authentication'))
  const user = auth.get('user')
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

  const drawAlert = () => {
    if (alert.message) {
      return (
        <Alert message={alert.message} type={alert.type} showIcon />
      )
    }
  }

  const drawLoginMenu = () => {
    if (!auth.get('loggedIn')) {
      return (
        <Menu.Item key="login" style={{float: 'right'}}>
          <Link to={getLoginUri()}>로그인</Link>
        </Menu.Item>
      )
    }
  }

  const getMyBookshelfUrl = () => {
    if (!auth.get('loggedIn')) {
      return '#'
    }
    return `/user/collection/${user.get('id')}/own`
  }

  const onLogout = () => {
    dispatch(userActions.logout())
  }

  const userMenu = (
    <Menu>
      <Menu.Item key="bookshelf">
        <Link to={getMyBookshelfUrl()}>내 책장</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <a onClick={onLogout}>로그아웃</a>
      </Menu.Item>
    </Menu>
  )

  const drawUserInfo = () => {
    if (auth.get('loggedIn')) {
      return (
        <Menu.Item key="user-info" style={{float: 'right'}}>
          <Dropdown overlay={userMenu} trigger={['click', 'hover']} >
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              {user.get('nickname')} <DownOutlined />
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
          <Menu.Item key="1">Menu 1</Menu.Item>
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
            <Route exact path="/" component={Main} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/register/welcome" component={RegisterWelcomePage} />
            <Route exact path="/login" component={LoginPage} />

            <Route path="/user/collection/:id/:category" component={CollectionPage} />
            <Route path="/item/:id" component={PageItemInfo} />
            <LoginRoute exact path="/user/import" component={PageUserImport} />
            <LoginRoute exact path="/item/create" component={ItemCreate} />
            <Redirect from="*" to="/" />
          </Switch>
        </div>      
      </Content>
      <Footer style={{ textAlign: 'center' }}>BoardGameHub ©2020 Created by WSong</Footer>
    </Layout>
  )
}