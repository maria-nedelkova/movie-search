import React from 'react'
import ReactDOM from 'react-dom'
import Swal from 'sweetalert2'
import {authenticate, getSessionId, isSessionIdValid} from './Requests'
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

const showFailureAlert = () => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    html: 'Something went wrong. Please, reload the page',
    confirmButtonColor: '#90cea1',
  })
}

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

if(localStorage.requestToken) {
  if(isRequestTokenValid()) {
    if(localStorage.sessionId) {
      if(isSessionIdValid()) {
        renderApp()
      } else {
        getSessionId(localStorage.requestToken)
          .then(renderApp())
          .catch(showFailureAlert())
      }
    } else {
      getSessionId(localStorage.requestToken)
        .then(renderApp())
        .catch(showFailureAlert())
    }
  } else {
    authenticate()
  }
} else {
  authenticate()
}

//localStorage.clear();
