import React, { Component } from 'react';
import './Inlinescore.css';

class Inlinescore extends Component {
  render() {
    return(
      <span className="inlinescore">
        <span className="panel">{ this.props.score[0] }</span>
        <span className="scorevs">
          <span className="dot dot-1"></span>
          <span className="dot dot-2"></span>
        </span>
      <span className="panel">{ this.props.score[1] }</span>
      </span>
    )
  }
}

export default Inlinescore;

