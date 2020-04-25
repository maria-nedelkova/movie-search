import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'

class Movie extends React.Component {
  constructor(props) {
    super(props);

  }



  render(){
    const {title} = this.props
    return (
      <div className="movie">
        <div className="movie-title">{title}</div>
        <div className="icon-container">
          <FontAwesomeIcon icon={faTrash} className="mv-icon"/>
          <FontAwesomeIcon icon={faCheck} className="mv-icon"/>
        </div>
      </div>
    );
  }

}

export default Movie
