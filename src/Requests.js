const api_key = 'ac980bf363ce39da4c171c32479493d7'
const token_endpoint = 'https://api.themoviedb.org/3/authentication/token/new?api_key='
const session_endpoint = 'https://api.themoviedb.org/3/authentication/session/new?api_key='
const authenticate_endpoint = 'https://www.themoviedb.org/authenticate/'
const top_rated_endpoint = 'https://api.themoviedb.org/3/movie/top_rated?api_key='
const search_movie_endpoint = 'https://api.themoviedb.org/3/search/movie?api_key='
const mark_as_fav_endpoint = 'https://api.themoviedb.org/3/account/{account_id}/favorite?api_key='
const get_favorites_endpoint = 'https://api.themoviedb.org/3/account/{account_id}/favorite/movies?api_key='
const add_to_watchlist_endpoint = 'https://api.themoviedb.org/3/account/{account_id}/watchlist?api_key='
const get_watchlist_endpoint = 'https://api.themoviedb.org/3/account/{account_id}/watchlist/movies?api_key='
const redirect_to = '?redirect_to='
const public_url = 'http://3f9fc0a1.ngrok.io'

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
    }).catch(error => {
      console.log('request failed', error)
    })
}

const getMovies = endpoint => {
  return fetch(endpoint)
   .then(response => checkStatus(response))
   .then(response => parseJSON(response))
   .then(data => {
     return data.results.map(movie => {
       return {
                id: movie.id,
                title: movie.title,
                posterPath: movie.poster_path
              }
     })
   }).catch(error => {
     console.log('request failed', error)
   })
}

const getTopRatedMovies = page => {
   return getMovies(top_rated_endpoint + api_key + '&page=' + page)
}

const searchMovies = (searchValue, page) => {
  return getMovies(search_movie_endpoint + api_key + '&query=' + searchValue + '&page=' + page)
}

const getFavorites = (sessionId, page) => {
  return getMovies(get_favorites_endpoint + api_key + '&session_id=' + sessionId + '&page=' + page)
}

const getWatchList = (sessionId, page) => {
  return getMovies(get_watchlist_endpoint + api_key + '&session_id=' + sessionId + '&page=' + page)
}

const postData = (endpoint, body) => {
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(body),
    })
    .then(response => checkStatus(response))
    .catch(error => {
      console.log('request failed', error)
    })
}

const markAsFavorite = (sessionId, movieId) => {
  const body = {
    media_type: "movie",
    media_id: movieId,
    favorite: true
  }
  postData(mark_as_fav_endpoint + api_key + '&session_id=' + sessionId, body)
}

const addToWatchList = (sessionId, movieId) => {
  const body = {
    media_type: "movie",
    media_id: movieId,
    watchlist: true
  }
  postData(add_to_watchlist_endpoint + api_key + '&session_id=' + sessionId, body)
}


export {getTopRatedMovies, authenticate, getSessionId, searchMovies, markAsFavorite, getFavorites, addToWatchList, getWatchList}
