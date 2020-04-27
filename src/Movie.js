import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import img_not_av from './poster_not_available.jpg'

const Movie = props => {
    const imgUrl = 'https://image.tmdb.org/t/p/'
    const size = 'w200'
    const {id, title, highlightButton, posterPath} = props
    let animationFav, animationWlater
    const imgSrc = imgUrl + size + posterPath
    const posterImage = posterPath ? <img src={imgSrc} alt="Image is not available" className="poster"/> :
                                     <img src={img_not_av} alt="Image is not available" className="poster"/>

    if(highlightButton) {
      if(highlightButton == 'addToFavorites'){
        animationFav = {animationName: 'highlight'}
        animationWlater = {}
      } else {
        animationWlater = {animationName: 'highlight'}
        animationFav = {}
      }
    } else {
      animationFav = {}
      animationWlater = {}
    }

    return (
      <div className="movie">
        <div className="movie-title">{title}</div>
        {posterImage}
        <div className="icon-container">
          <FontAwesomeIcon icon={faClock}
                           className="mv-icon"
                           style={animationWlater}
                           onClick={() => {props.addtoWatchLater(id)}}/>
          <FontAwesomeIcon icon={faThumbsUp}
                           className="mv-icon"
                           style={animationFav}
                           onClick={() => {props.addToFavorites(id)}}/>
        </div>
      </div>
    );
}

export default Movie
