import React, { useRef, useState, Suspense } from "react";
//Components
import Room from "./components/Room/room";
import NavApp from './components/layout/Nav';
import Home from './components/views/Home';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './redux/store';

// Styles
import "./App.scss";




const App = () => {
  // const Texture = useLoader(TextureLoader, 'https://i.ibb.co/Qdm3FHq/Ambush-Alley-BKG-5.jpg')
  // console.log(store)
  return (
    <Provider store={store}>
      <Router>
        <div>
          <NavApp />
        </div>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/experience" component={Room} />
                {/* <Route exact path="/:slug" component={ViewPost} /> */}
              </Switch>
        </Router>
      </Provider>
  );
};

export default App;
