import React, { Component } from 'react';
import './Pronocard.css';

class Pronocard extends Component {
  render() {
    return(
      <div className="pronocard">
        <div className="">{this.props.title}</div>
      </div>
    )
  }
}

export default Pronocard;

