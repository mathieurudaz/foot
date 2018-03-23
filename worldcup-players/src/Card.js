import React, { Component } from 'react';
import './Card.css';

class Card extends Component {

  constructor(props) {
    super(props);
    this.styleId = Math.floor(Math.random()*3)
    this.style = {
      left: 200 + Math.random() * (this.props.bounds[0] - 600),
      top: Math.random() * (this.props.bounds[1] - 300),
      transform: "rotate("+(Math.random()*360)+"deg)"
    }
  }

  render() {
    return (
      <div className={"card style-"+this.styleId} style={this.style}>
        <div className="inner-card">
          <div className="name">
            <div className="first-name">José</div>
            <div className="last-name">Cavani</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
