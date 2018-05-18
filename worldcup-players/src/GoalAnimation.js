import React, { Component } from 'react';
import './GoalAnimation.css';

class GoalAnimation extends Component {
  render() {
    return(
      <div className='goalanimation ui container'>
        <div className="">Texte </div>
        <img className="ui fluid image" src={require("./images/best_goal_1-08.png")} />
      </div>
    )
  }
}

export default GoalAnimation;

