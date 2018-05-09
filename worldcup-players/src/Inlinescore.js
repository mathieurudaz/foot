import React, { Component } from 'react';
import './Inlinescore.css';

class Inlinescore extends Component {
  render() {
    return(
      <div className="inlinescore">
        <div className="panel">{ this.props.score[0] }</div>
        <div className="scorevs">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
        </div>
      <div className="panel">{ this.props.score[1] }</div>
      </div>
    )
  }
}

export default Inlinescore;

