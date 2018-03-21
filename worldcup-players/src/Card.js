import React, { Component } from 'react';
import './Card.css';

class Card extends Component {

  constructor(props) {
    super(props);
    this.style = {
      left: Math.random() * (this.props.bounds[0] - 200),
      top: Math.random() * (this.props.bounds[1] - 300),
      transform: "rotate("+(Math.random()*360)+"deg)"
    }
  }

  render() {
    return (
      <div className="card" style={this.style}>
        <div className="inner-card">
          <div className="name">José Cavani</div>
        </div>
      </div>
    );
  }
}

export default Card;
