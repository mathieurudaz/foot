import React, { Component } from 'react';
import scrollToComponent from 'react-scroll-to-component';
import Player from './Player';
import Question from './Question';
import Answer from './Answer';
import CardsContainer from './CardsContainer';
import './App.css';

const questions = [
  {
    "title": "Voyagez vous régulièrement?",
    "answers": ["Seulement pendant les vacances", "Dès que j'ai 500 francs sur mon compte"]
  },{
    "title": "Quelle est votre taille?",
    "answers": ["On dit que je suis petit", "Comme les autres", "On me surnomme la perche"]
  },{
    "title": "Quel est votre poids?",
    "answers": ["Poids plume", "Juste ce qu'il faut", "J'aime la raclette"]
  },{
    "title": "Dans la vie, vous pensez que...",
    "answers": ["La meilleure attaque c'est la défense", "Il faut toujours aller de l'avant", "Il faut gagner la terre du milieu", "Il ne faut rien laisser passer"]
  },{
    "title": "Quelle est votre couleur préférée?",
    "answers": ["Rouge", "Vert", "Jaune", "Bleu", "Blanc"]
  },{
    "title": "A quoi ressemble votre appartement?",
    "answers": ["Toujours rangé", "Presque en ordre", "Je laisse libre cours à mes envies"]
  },{
    "title": "On vous bouscule dans la rue, que faites-vous?",
    "answers": ["Sur de ma force, je continue comme si de rien", "Je m'arrête et fait une remarque", "je pousse l'autre immédiatement"]
  },{
    "title": "Etes-vous droitier ou gaucher?",
    "answers": ["Droitier", "Gaucher"]
  },
  {
    "title": "Qu'y a t il de plus important pour vous?",
    "answers": ["Marquer", "Faire la passe juste", "Etre un bon coequipier"]
  }
]

const players = [
  {
    "firstname": "Jose",
    "lastname": "Cavani",
    "country": "Pays-Bas",
    "bio": "Duis ut nibh vitae felis sodales sagittis eget eget est. Morbi nulla neque, ornare eget nisi sed, facilisis mattis libero. Mauris feugiat suscipit ipsum, eget eleifend nunc. Donec ut massa molestie, euismod enim non, maximus enim. Fusce placerat neque vitae velit euismod luctus. Donec id mi vel purus hendrerit ornare."
  }
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTemplate: 0,
      answers: new Array(questions.length).fill(null)
    };
    this.answeredHandler = this.answeredHandler.bind(this);
    this.setNextTemplate = this.setNextTemplate.bind(this);
    this.start = this.start.bind(this);
    this.questionComponents = []
  }

  start(){
    setTimeout(() => {scrollToComponent(this.questionComponents[0])}, 250)
  }

  setNextTemplate(){
    this.setState({"currentTemplate": (this.state.currentTemplate + 1) % 7})
  }

  gotoNextQuestion(id){
    let nextQuestionId = (id+1) % questions.length
    let anchor = this.questionComponents[nextQuestionId]

    if(!this.state.answers.includes(null)){
      anchor = this.player
    }

    setTimeout(() => {scrollToComponent(anchor)}, 500)
  }

  answeredHandler(questionId, answerId) {
    console.log("Question "+questionId + " answered. " + "Answer " + answerId)
    let a = this.state.answers
    a[questionId] = answerId
    this.setState({"answers": a})
    this.gotoNextQuestion(questionId)
    console.log(this.state.answers)
  }

  render() {
    return (
      <div className={"app style-" + this.state.currentTemplate}>
        <div onClick={this.setNextTemplate} className='templates-selector'></div>
        <CardsContainer cards={[
          1,2,3,4,5,6,7,8,9,10,
          1,2,3,4,5,6,7,8,9,10,
          1,2,3,4,5,6,7,8,9,10,
          1,2,3,4,5,6,7,8,9,10,
          1,2,3,4,5,6,7,8,9,10,
          1,2,3,4,5,6,7,8,9,10,
          1,2,3,4,5,6,7,8,9,10,
          1,2,3,4,5,6,7,8,9,10,
          1,2,3,4,5,6,7,8,9,10]} />
        <div className="title container">
          <div><h1>Quelle star du mondial êtes-vous?</h1></div>
          <div><Answer
                label="Commencer"
                faded={false}
                handleChange={this.start} />
          </div>
        </div>
        <div className='questions'>
          { questions.map((question, index) => {
              return <div className="question-container" id={"question-"+index} key={index}>
                        <Question
                          key={index}
                          id={index}
                          questionMax={questions.length}
                          ref={Question => {this.questionComponents[index] = Question;}}
                          onAnswered={this.answeredHandler}
                          title={question.title.toUpperCase()}
                          answers={question.answers} />
                      </div>
              })
          }
        </div>
        <Player id="0"
          player={players[0]}
          answers={this.state.answers}
          ref={Player => {this.player = Player}} />
      </div>
    );
  }
}

export default App;
