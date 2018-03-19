import React, { Component } from 'react';
import './Question.css';

class Question extends Component {
  render() {
    return (
      <div className="question">
        <div className="header">
          <h2>{this.props.title}</h2>
          <div className="num" />
            {this.props.answers.map((answer, index) => { return <div className="answer" key={index}>{answer}</div>})}
        </div>
      </div>
    );
  }
}

export default Question;
