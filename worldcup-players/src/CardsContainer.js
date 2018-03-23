import React, { Component } from 'react';
import Card from './Card';
import './CardsContainer.css';

class CardsContainer extends Component {
  constructor(props) {
    super(props);
    this.node
    this.scrollHandler = this.scrollHandler.bind(this)
    this.state = {
      position:0
    }
  }

  componentDidMount() {
      window.addEventListener('scroll', this.scrollHandler);
  }

  componentWillUnmount() {
      window.removeEventListener('scroll', this.scrollHandler);
  }

  setPosition(){
    return {transform: "translate(0px, "+(this.state.position/2)+"px)"}
  }

  scrollHandler(){
    this.setState({
      position: window.scrollY
    })
  }

  render() {
    return (
      <div className="cards_container" style={this.setPosition()} ref={CardsContainer => {this.node = CardsContainer}}>
        {this.props.cards.map(cards => {return <Card bounds={
          [window.innerWidth,
          window.innerHeight*4.5]}/>}, this)}
      </div>
    );
  }
}

export default CardsContainer;
