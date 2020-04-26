import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

class Movie extends React.Component {
  constructor(props) {
    super(props);

  }



  render(){
    const {id, title, highlightButton} = this.props
    let animationFav, animationWlater

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
        <div className="icon-container">
          <FontAwesomeIcon icon={faClock}
                           className="mv-icon"
                           style={animationWlater}
                           onClick={() => {this.props.addtoWatchLater(id)}}/>
          <FontAwesomeIcon icon={faThumbsUp}
                           className="mv-icon"
                           style={animationFav}
                           onClick={() => {this.props.addToFavorites(id)}}/>
        </div>
      </div>
    );
  }

}

export default Movie
