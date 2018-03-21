import React, { Component } from 'react';
import Card from './Card';
import './CardsContainer.css';

class CardsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="cards_container">
        {this.props.cards.map(cards => {return <Card bounds={
          [window.innerWidth,
          window.innerHeight]}/>}, this)}
      </div>
    );
  }
}

export default CardsContainer;
