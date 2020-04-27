import React from 'react'
import Movie from './Movie'
import {getTopRatedMovies, searchMovies, markAsFavorite, getFavorites, addToWatchList, getWatchList} from './Requests'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEarlybirds } from '@fortawesome/free-brands-svg-icons'
import { faTv, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import logo from './tmdb_logo.svg'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: this.props.sessionId,
      movies: [],
      title: '',
      dropDownVisible: false,
      searchVisible: false,
      searchValue: '',
      highlight: {
        movieId: '',
        buttonType: ''
      },
      lastRequest: '',
      page: 1,
    };
    this.initialPage = 1
    this.typingTimerSearch = ''
  }

  handleMenuClick() {
    if(this.state.dropDownVisible){
      this.setState({
        dropDownVisible: false
      });
    } else {
      this.setState({
        dropDownVisible: true
      });
    }
  }

  handleSearchClick() {
    if(this.state.searchVisible){
      this.showTopRated()
      this.setState({
        searchVisible: false
      });
    } else {
      this.setState({
        searchVisible: true,
        searchValue: ''
      });
    }
  }

  handleSearchValueChange() {
    const searchValue = event.target.value
    this.setState({
      searchValue: searchValue
    });
    clearTimeout(this.typingTimerSearch)
    this.typingTimerTask = setTimeout(() => {
      if(searchValue){
        const encodedValue = encodeURI(searchValue)
        searchMovies(encodedValue, this.initialPage)
         .then(movies => {
           this.setState({
             title: 'Search Result',
             movies: movies,
             lastRequest: 'searchMovies',
             page: this.initialPage
           });
         })
      }
    }, 2000)
  }

  handleKeyDown() {
    const searchValue = event.target.value
    if (event.key === "Enter") {
        if(searchValue){
          const encodedValue = encodeURI(searchValue)
          searchMovies(encodedValue, this.initialPage)
           .then(movies => {
             this.setState({
               title: 'Search Result',
               movies: movies,
               lastRequest: 'searchMovies',
               page: this.initialPage
             });
           })
        }
     }
   }

  addToFavorites(id) {
    markAsFavorite(this.state.sessionId, id)
    this.setState({
      highlight: {
        movieId: id,
        buttonType: 'addToFavorites'
      },
    });
  }

  addToWatchLater(id) {
    addToWatchList(this.state.sessionId, id)
    this.setState({
      highlight: {
        movieId: id,
        buttonType: 'addToWatchLater'
      },
    });
  }

  showTopRated() {
    getTopRatedMovies(this.initialPage)
     .then(topRatedMovies => {
       this.setState({
         movies: topRatedMovies,
         title: 'Top Rated Movies',
         lastRequest: 'getTopRatedMovies',
         page: this.initialPage
       });
     })
     this.setState({
       dropDownVisible: false
     });
  }

  showFavorites() {
    getFavorites(this.state.sessionId, this.initialPage)
     .then(favorites => {
       this.setState({
         movies: favorites,
         title: 'Favorite Movies',
         lastRequest: 'getFavorites',
         page: this.initialPage
       });
     });

     this.setState({
       dropDownVisible: false
     });
  }

  showWatchList() {
    getWatchList(this.state.sessionId, this.initialPage)
     .then(watchList => {
       this.setState({
         movies: watchList,
         title: 'Watch Later',
         lastRequest: 'getWatchList',
         page: this.initialPage
       });
     });

     this.setState({
       dropDownVisible: false
     });
  }

  showMore() {
    const lastRequest = this.state.lastRequest
    const nextPage = this.state.page + 1
    const requests = {
      getTopRatedMovies: () => {
        getTopRatedMovies(nextPage)
         .then(topRatedMovies => {
           this.setState({
             movies: [...this.state.movies, ...topRatedMovies],
             title: 'Top Rated Movies',
             lastRequest: 'getTopRatedMovies',
             page: nextPage
           });
         })
      },
      searchMovies: () => {
        const searchValue = this.state.searchValue
        if(searchValue){
          const encodedValue = encodeURI(searchValue)
          searchMovies(encodedValue, nextPage)
           .then(movies => {
             this.setState({
               title: 'Search Result',
               movies: [...this.state.movies, ...movies],
               lastRequest: 'searchMovies',
               page: nextPage
             });
           })
        }
      },
      getFavorites: () => {
        getFavorites(this.state.sessionId, nextPage)
         .then(favorites => {
           this.setState({
             movies: [...this.state.movies, ...favorites],
             title: 'Favorite Movies',
             lastRequest: 'getFavorites',
             page: nextPage
           });
         });
      },
      getWatchList: () => {
        getWatchList(this.state.sessionId, nextPage)
         .then(watchList => {
           this.setState({
             movies: [...this.state.movies, ...watchList],
             title: 'Watch Later',
             lastRequest: 'getWatchList',
             page: nextPage
           });
         });
      }
    }
    requests[lastRequest]()
  }

  renderMovies() {
    let highlightButton = ''
    const movies = this.state.movies.map((movie, index) => {
      if(movie.id == this.state.highlight.movieId) {
        highlightButton = this.state.highlight.buttonType
      } else {
        highlightButton = ''
      }
      return (
        <Movie key = {movie.id + index.toString()}
               id = {movie.id}
               title = {movie.title}
               highlightButton = {highlightButton}
               addToFavorites = {(id) => {this.addToFavorites(id)}}
               addtoWatchLater = {(id) => {this.addToWatchLater(id)}}
        />
      );
    });
    return movies
  }

  render() {
    const { dropDownVisible, searchVisible, title, searchValue } = this.state
    const topNavClassName = dropDownVisible ? 'navbar-dark clearfix':'navbar clearfix'
    const dropDownClassName = dropDownVisible ? 'dropdown-menu-visible':'dropdown-menu-hidden'
    const barClassName = dropDownVisible ? 'bar-container bar-to-x':'bar-container'
    const searchIconClassName = searchVisible ? 'search-container-icon-expand':'search-container-icon'
    const crossIconClassName = searchVisible ? 'cross-container-icon-expand':'cross-container-icon'
    const searchInputClassName = dropDownVisible ? (searchVisible ? 'search-container-input-expand-blue':
                                                                  'search-container-input-blue'):
                                                 (searchVisible ? 'search-container-input-expand':
                                                                  'search-container-input')

    return (
      <div style={{height: '100%'}}>
        <div className={topNavClassName}>
          <div className="logo">
            <FontAwesomeIcon icon={faTv} className="movie-icon"/>
            <div className="logo-text">Movie Search</div>
          </div>
          <div className={barClassName} onClick={() => this.handleMenuClick()}>
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
          <div className={crossIconClassName} onClick={() => this.handleSearchClick()}>
            <FontAwesomeIcon icon={faTimes} className="search-icon"/>
          </div>
          <input className={searchInputClassName}
                 value={searchValue}
                 type="text"
                 maxLength="30"
                 onChange={() => {this.handleSearchValueChange(event)}}
                 onKeyDown={() => {this.handleKeyDown(event)}}
          />
          <div className={searchIconClassName} onClick={() => this.handleSearchClick()}>
            <FontAwesomeIcon icon={faSearch} className="search-icon"/>
          </div>
          <div className={dropDownClassName}>
            <a onClick={() => {this.showTopRated()}}>Top rated</a>
            <a onClick={() => {this.showFavorites()}}>Favorites</a>
            <a onClick={() => {this.showWatchList()}}>Watch later</a>
          </div>
        </div>
        <div className="bkground">
          <div className="title">{title}</div>
          <div className="movie-container">
             {this.renderMovies()}
          </div>
          <div className="more-btn-container">
            <div className="show-more" onClick={() => {this.showMore()}}>Show more</div>
          </div>
        </div>
        <footer className="footer">
        <div className="tmbd-logo-div"><img src={logo} className="tmdb-logo"/></div>
        <div><p>This product uses the TMDb API but is not endorsed or certified by TMDb.</p></div>
        </footer>
      </div>

    );
  }

  componentDidMount() {
    this.showTopRated()
  }

}

export default App
