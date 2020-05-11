import React from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'

import Main from './pages/Main'
import ItemCreate from './pages/ItemCreate'

function App() {
  return (
    <div className="container">
        <nav className="navbar sticky-top navbar-light bg-light">
            <a className="navbar-brand" href="#">Sticky top</a>
        </nav>
        <div className="mt-2">
          <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/item/create" component={ItemCreate} />
          </Switch>
        </div>
    </div>
  );
}

export default App