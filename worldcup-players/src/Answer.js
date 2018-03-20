import React, { Component } from 'react';
import './Answer.css';

class Answer extends Component {
  render() {
    return (
      <div
        className={this.props.faded ? 'answer faded': 'answer'}
        onClick={() => this.props.handleChange(this.props.id)}>
          {this.props.label.toUpperCase()}
      </div>
    );
  }
}

export default Answer;
