import React, { Component } from 'react';
import './Answer.css';

class Answer extends Component {
  videoAnswer() {
    if(this.props.label.substr(0, 4) === "http"){
      return true
    }else{
      return false
    }
  }

  getClassNames(){
    let classes = ["answer"];
    if (this.props.faded){
      classes.push("faded")
    }
    if(this.videoAnswer()){
      classes.push("gif")
    }
    return classes.join(" ")
  }

  render() {
    return (
      <div
        className={this.getClassNames()}
        // TODO: Detect the end CSS transition event instead
        // of setting a timer
        onClick={() => this.props.handleChange(this.props.id)}>
          {!this.videoAnswer() ? this.props.label.toUpperCase() : <img style={{width:"100%", height:"auto"}} src={this.props.label} alt="" />}
      </div>
    );
  }
}

export default Answer;
