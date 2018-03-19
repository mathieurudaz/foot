import React, { Component } from 'react';
import Question from './Question';
import './App.css';

const questions = [
  {
    "title": "Question A",
    "answers": ["A", "B", "C"],
    "id": 0
  },{
    "title": "Question B",
    "answers": ["A", "B", "C"],
    "id": 1
  },{
    "title": "Question C",
    "answers": ["A", "B", "C"],
    "id": 2
  },{
    "title": "Question D",
    "answers": ["A", "B", "C"],
    "id": 3
  },{
    "title": "Question E",
    "answers": ["A", "B", "C"],
    "id": 4
  },{
    "title": "Question F",
    "answers": ["A", "B", "C"],
    "id": 5
  },{
    "title": "Question G",
    "answers": ["A", "B", "C"],
    "id": 6
  },{
    "title": "Question H",
    "answers": ["A", "B", "C"],
    "id": 7
  }
]

class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
          {questions.map(question => { return <Question
            key={question.id}
            title={question.title.toUpperCase()}
            answers={question.answers} />})}
        </div>
      </div>
    );
  }
}

export default App;
