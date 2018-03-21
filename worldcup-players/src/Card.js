import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedAnswer: null};
    this.handler = this.handler.bind(this)
  }

  handler(id) {
    this.setState({
      selectedAnswer: id
    })
    this.props.onAnswered(this.props.id, id);
  }

  render() {
    return (
      <div className="card">
        <div className="inner-card">
          <div className="name">José Cavani</div>
        </div>
      </div>
    );
  }
}

export default Card;
