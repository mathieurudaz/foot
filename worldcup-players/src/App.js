import React, { Component } from 'react';
import Question from './Question';
import './App.css';

const questions = [
  {
    "title": "Question A",
    "answers": ["Réponse A", "Réponse B"]
  },{
    "title": "Question B",
    "answers": ["Réponse A", "Réponse B"]
  },{
    "title": "Question C",
    "answers": ["Réponse A", "Réponse B", "Réponse C"]
  },{
    "title": "Question D",
    "answers": ["Réponse A", "Réponse B", "Réponse C"]
  },{
    "title": "Question E",
    "answers": ["Réponse A", "Réponse B", "Réponse C", "Réponse D"]
  },{
    "title": "Question F",
    "answers": ["Réponse A", "Réponse B", "Réponse C"]
  },{
    "title": "Question G",
    "answers": ["Réponse A", "Réponse B", "Réponse C"]
  },{
    "title": "Question H",
    "answers": ["Réponse A", "Réponse B", "Réponse C"]
  }
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {currentQuestion: 0};
    this.answeredHandler = this.answeredHandler.bind(this);
  }
  gotoQuestion(id){
    let nextQuestionId = (id+1) % questions.length
    console.log("Goto question " + nextQuestionId)
    // TODO: Use react plugin, on component, not directly dom selection
    window.scrollTo(0, document.getElementById("question-"+nextQuestionId).offsetTop);
  }
  answeredHandler(id) {
    console.log("Question "+id + " answered.")
    this.gotoQuestion(id)
  }
  render() {
    return (
      <div className="App">
        <div className='questions'>
          { questions.map((question, index) => {
              return <div className="question-container" id={"question-"+index}>
                        <Question
                          key={index}
                          id={index}
                          onAnswered={this.answeredHandler}
                          title={question.title.toUpperCase()}
                          answers={question.answers} />
                      </div>
              })
          }
        </div>
      </div>
    );
  }
}

export default App;
