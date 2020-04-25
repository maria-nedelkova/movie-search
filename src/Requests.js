const api_key = 'ac980bf363ce39da4c171c32479493d7'
const token_endpoint = 'https://api.themoviedb.org/3/authentication/token/new?api_key='
const session_endpoint = 'https://api.themoviedb.org/3/authentication/session/new?api_key='
const authenticate_endpoint = 'https://www.themoviedb.org/authenticate/'
const top_rated_endpoint = 'https://api.themoviedb.org/3/movie/top_rated?api_key='
const redirect_to = '?redirect_to='
const public_url = 'http://f78b0072.ngrok.io'

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

const parseJSON = response => {
  return response.json()
}

const authenticate = () => {
  fetch(token_endpoint + api_key)
    .then(response => checkStatus(response))
    .then(response => parseJSON(response))
    .then(data => {
      localStorage.setItem('requestToken', data.request_token)
      localStorage.setItem('requestTokenExp', data.expires_at)
      window.location.href = authenticate_endpoint +
                             data.request_token +
                             redirect_to +
                             public_url
    }).catch(error => {
      console.log('request failed', error)
    })
}

const getSessionId = request_token => {
  fetch(session_endpoint + api_key, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({request_token}),
   })
    .then(response => checkStatus(response))
    .then(response => parseJSON(response))
    .then(data => {
      localStorage.setItem('sessionId', data.session_id)
      const currentTime = new Date();
      const timeInMs = currentTime.getTime()
      const sessionIdExpInMs = timeInMs + (1000 * 60 * 60)
      const sessionIdExp = new Date(sessionIdExpInMs)
      localStorage.setItem('sessionExp', sessionIdExp.toString())
      console.log(localStorage.sessionId)
    }).catch(error => {
      console.log('request failed', error)
    })
}

const getTopRatedMovies = () => {
   return fetch(top_rated_endpoint + api_key)
    .then(response => checkStatus(response))
    .then(response => parseJSON(response))
    .then(data => {
      return data.results.map(movie => {
        return {
                 id: movie.id,
                 title: movie.original_title,
                 posterPath: movie.poster_path
               }
      })
    }).catch(error => {
      console.log('request failed', error)
    })
}

export {getTopRatedMovies, authenticate, getSessionId}
