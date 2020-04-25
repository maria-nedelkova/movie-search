import React from 'react'
import Movie from './Movie'
import {getTopRatedMovies} from './Requests'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEarlybirds } from '@fortawesome/free-brands-svg-icons'
import { faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import logo from './tmdb_logo.svg'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: this.props.sessionId,
      movies: [],
      title: 'Top Rated Movies',
      dropDownVisible: false,
      searchVisible: false,
    };
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
      this.setState({
        searchVisible: false
      });
    } else {
      this.setState({
        searchVisible: true
      });
    }
  }

  renderMovies() {
    const movies = this.state.movies.map(movie => {
      return (
        <Movie key={movie.id}
               title = {movie.title}
        />
      );
    });
    return movies
  }

  render() {
    const { dropDownVisible, searchVisible, title } = this.state
    const topNavClassName = dropDownVisible ? 'navbar-dark clearfix':'navbar clearfix'
    const dropDownClassName = dropDownVisible ? 'dropdown-menu-visible':'dropdown-menu-hidden'
    const barClassName = dropDownVisible ? 'bar-container bar-to-x':'bar-container'
    const searchIconClassName = searchVisible ? 'search-container-icon-expand':'search-container-icon'
    const searchDivClassName = searchVisible ? 'search-container-div-expand':'search-container-div'
    return (
      <div style={{height: '100%'}}>
        <div className={topNavClassName}>
          <div className="logo">
            <FontAwesomeIcon icon={faEarlybirds}/>Movie Search
          </div>
          <div className={barClassName} onClick={() => this.handleMenuClick()}>
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
          <div className={searchIconClassName} onClick={() => this.handleSearchClick()}>
            <FontAwesomeIcon icon={faTimes} className="search-icon"/>
          </div>
          <input className={searchDivClassName}
                 type="text"
                 maxLength="30"
          />
          <div className={searchIconClassName} onClick={() => this.handleSearchClick()}>
            <FontAwesomeIcon icon={faTrash} className="search-icon"/>
          </div>
          <div className={dropDownClassName}>
            <a href="#">Favorites</a>
            <a href="#">Watch later</a>
          </div>
        </div>
        <div className="bkground">
          <div className="title">{title}</div>
          <div className="movie-container">
                    {this.renderMovies()}
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
    getTopRatedMovies()
     .then(topRatedMovies => {
       this.setState({
         movies: topRatedMovies
       });
     })
  }

}

export default App
