import React, { Component } from 'react';
import './GoalAnimation.css';

class GoalAnimation extends Component {

  render() {
    return(
      <div className='goalanimation ui container'>

          <div className='ui container computer or lower hidden'>
              <img className="ui fluid image" src={require("./images/best_goal_legend.png")} style={{margin: "0px 0px 0px 0px"}}/>
              <img className="ui fluid" src={require("./images/best_goal_desktop.gif")} />
          </div>

          <div className='ui container widescreen hidden large screen hidden'>
              <img className="ui fluid" src={require("./images/best_goal_desktop.gif")} />
          </div>
      </div>
    )
  }
}

export default GoalAnimation;

