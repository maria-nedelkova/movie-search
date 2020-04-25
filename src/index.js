import React from 'react'
import ReactDOM from 'react-dom'
import {authenticate, getSessionId} from './Requests'
import App from './App'
import './MainPageIni.css'
import './MovieStyles.css'

const isRequestTokenValid = () => {
  const currentTime = new Date()
  const requestTokenExp = new Date(localStorage.requestTokenExp)
  if(currentTime.getTime() > requestTokenExp.getTime()) {
    return false
  } else {
    return true
  }
}

const isSessionIdValid = () => {
  const currentTime = new Date()
  const sessionExp = new Date(localStorage.sessionExp)
  if(currentTime.getTime() > sessionExp.getTime()) {
    return false
  } else {
    return true
  }
}

if(localStorage.requestToken) {
  if(isRequestTokenValid()) {
    if(localStorage.sessionId) {
      if(isSessionIdValid()) {
        ReactDOM.render(<App sessionId={localStorage.sessionId}/>, document.getElementById('root'));
      } else {
        getSessionId(localStorage.requestToken)
        ReactDOM.render(<App sessionId={localStorage.sessionId}/>, document.getElementById('root'));
      }
    } else {
      getSessionId(localStorage.requestToken)
      ReactDOM.render(<App sessionId={localStorage.sessionId}/>, document.getElementById('root'));
    }
  } else {
    authenticate()
  }
} else {
  authenticate()
}

//localStorage.clear();
