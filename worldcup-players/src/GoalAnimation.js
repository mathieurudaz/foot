import React, { Component } from 'react';
import './GoalAnimation.css';

class GoalAnimation extends Component {
  render() {
    return(
      <div className='goalanimation ui container' style={{perspective: '816px'}}>
        <img className="ui fluid image" style={{transform: 'rotatex(50deg)'}} src={require("./images/best_goal_1-08.png")} />
      </div>
    )
  }
}

export default GoalAnimation;

