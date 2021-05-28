import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import User from './pages/User/User'

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/users/:id">
        <User />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  </Router>
)

export default Routes
