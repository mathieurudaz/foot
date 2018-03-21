import React, { Component } from 'react';
import Answer from './Answer';
import './Question.css';

class Question extends Component {
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
      <div className="question">
        <div className="header">
          <h2>{this.props.title}</h2>
          <div className="num" />
          <div className="answers">
            {this.props.answers.map((answer, index) => {
              return <Answer
                key={index}
                id={index}
                label={answer}
                faded={(this.state.selectedAnswer === index || this.state.selectedAnswer === null) ? false : true}
                handleChange={this.handler} />}, this)}
          </div>
        </div>
      </div>
    );
  }
}

export default Question;
