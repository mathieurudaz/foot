import React, { Component } from 'react';
import scrollToComponent from 'react-scroll-to-component';
import Player from './Player';
import Question from './Question';
import Answer from './Answer';
import PlayersDb from './data/data.json';
import Masthead from '@ta-interaktiv/react-masthead'

import { displayTypes } from '@ta-interaktiv/react-share-buttons'
import FeedbackMessage from '@ta-interaktiv/react-feedback-message'
import PolymorphicShareButtons from '@ta-interaktiv/react-polymorphic-share-buttons'
import { TimestampFormatter } from '@ta-interaktiv/react-publication-info'

import '@ta-interaktiv/semantic-ui/semantic/dist/components/reset.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/site.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/segment.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/grid.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/table.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/header.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/divider.css'
import '@ta-interaktiv/semantic-ui/semantic/dist/components/image.css'

import './App.css';


const questions = [
  {
    "title": "Quelle est votre taille?",
    "answers": ["On dit que je suis petit", "Comme les autres", "On me surnomme la perche"]
  },{
    "title": "Quel est votre poids?",
    "answers": ["Poids plume", "Juste ce qu'il faut", "J'aime la raclette"]
  },{
    "title": "On vous bouscule dans la rue, que faites-vous?",
    "answers": ["Sur de ma force, je continue comme si de rien", "Je m'arrête et fais une remarque", "je pousse l'autre immédiatement"],
    "videoAnswers": ["https://media.giphy.com/media/3o7aDcRturpZG7Cxbi/giphy.gif", "https://media.giphy.com/media/A7Wi3pid1U5iVQ696I/giphy.gif","https://media.giphy.com/media/kuf7g0KM5UMBW/giphy.gif"]
  },{
    "title": "Êtes-vous droitier ou gaucher?",
    "answers": ["Gaucher", "Droitier"]
  },{
    "title": "Dans la vie, vous pensez que...",
    "answers": ["Il ne faut rien laisser passer", "La meilleure attaque c'est la défense", "Il faut gagner la terre du milieu", "Il faut toujours aller de l'avant"]
  },{
    "title": "Voyagez vous régulièrement ?",
    "answers": ["Dès que j'ai 500 francs sur mon compte", "Seulement pendant les vacances"]
  }
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTemplate: 0,
      answers: new Array(questions.length).fill(null),
      matchedPlayer: null
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

    // If all the questions have been answered
    if(!this.state.answers.includes(null)){
      // The next anchor is the player screen
      anchor = this.player
      setTimeout(() => {scrollToComponent(anchor, {align:"top"})}, 500)
      return 0;
    }

    setTimeout(() => {scrollToComponent(anchor)}, 500)
  }

  answeredHandler(questionId, answerId) {
    let a = this.state.answers
    a[questionId] = answerId
    this.setState({"answers": a})
    this.gotoNextQuestion(questionId)

    console.log("Question "+questionId + " answered. Answer " + answerId)
    console.log("Questions state:")
    console.log(this.state.answers)

    console.log()
    console.log("Set this answer to all the the players")
    for( var i=0; i<PlayersDb.length; i++ ){
      PlayersDb[i]["a" + questionId] = Math.abs(answerId - PlayersDb[i]["q" + questionId])
    }

    // Filter
    this.filterPlayers()
  }

  filterPlayers(){
    let fp = PlayersDb
    let matchedPlayer = null

    for(var i=0; i<this.state.answers.length; i++){
      // Filter the players with the same values
      if(this.state.answers[i] != null){
        fp = fp.filter(a=>{ return a["q" + i] === this.state.answers[i] })
      }
    }

    console.log("________________________________________________")

    // If no player with the same values, find the nearest
    if( fp.length === 0 ){
      console.log( "No match. Find the nearest player:" )
      console.log( "For each player, find the difference between the player's data and the user's one" )

      let sums = []
      for( var i=0; i<PlayersDb.length; i++ ){
        let sum = 0
        for( var j=0; j<3; j++ ){
          if( PlayersDb[i]["a"+j] != null ){
            sum += PlayersDb[i]["a"+j]
          }
        }
        sums.push(sum)
        PlayersDb[i]["asum"] = sum
      }

      let min = Math.min.apply(null,  sums)
      fp =  PlayersDb.filter(a=>{ return a["asum"] === min })

      console.log( "" )
      console.log( "Smallest value: " + min )
      console.log( "Nearest players pool:" )
      console.log( fp )
      console.log("Pick a random player from this pool:")
      matchedPlayer = fp[Math.floor(Math.random() * fp.length)]
      this.setState({exactMatch: false})
      console.log(matchedPlayer["firstname"] + " " + matchedPlayer["lastname"])

    // Else pick a random player in the filtered pool
    }else{
      console.log( "Matched players pool:" )
      console.log( fp )
      console.log("________________________________________________")
      matchedPlayer = fp[Math.floor(Math.random() * fp.length)]
      this.setState({exactMatch: true})
      console.log( "Pick a random player from this pool:" )
      console.log(matchedPlayer["firstname"] + " " + matchedPlayer["lastname"])
    }

    this.setState({
      matchedPlayer: matchedPlayer
    })

    console.log("=========================================")
    console.log("=========================================")
  }

  componentDidMount(){
      console.log( PlayersDb )
  }

  render() {
    return (
      <div className={"app style-" + this.state.currentTemplate}>
        <Masthead
          inverted={true}
          defaultLanguage="fr"
          mediaName='24heures'
          homepage='//www.24heures.ch'
          articleId='20417500'
          fullMediaName='24 heures'
          hashtags={['24heuresch']} />
        <div className="ui vertical very fitted title">
          <div className='ui container'>
            <div className='ui'>
              <div>
                <h2 className="surtitre">Coupe du monde 2018 </h2>
                <h1>Quel joueur de légende êtes-vous?</h1>
              </div>
              <div className="start-block"><div className="start-touch" onClick={this.start}>Commencer</div>
                    <div className="shortcut">Ou en lire plus sans répondre aux questions</div>
              </div>
            </div>
          </div>
        </div>
        <div className='questions'>
          { questions.map((question, index) => {
              return <div className="question-container" id={"question-"+index} key={index}>
                        {
                        //<div class="question-number">{index + 1}/{questions.length}</div>
                        }
                        <Question
                          key={index}
                          id={index}
                          questionMax={questions.length}
                          ref={Question => {this.questionComponents[index] = Question;}}
                          onAnswered={this.answeredHandler}
                          title={question.title.toUpperCase()}
                          answers={question.videoAnswers ? question.videoAnswers : question.answers} />
                      </div>
              })
          }
        </div>
        <Player
          id="0"
          exactMatch={this.state.exactMatch}
          player={this.state.matchedPlayer}
          answers={this.state.answers}
          ref={Player => {this.player = Player}} />
        <main className='ui vertical very inverted fitted segment text-chapter' style={{/*backgroundColor: "#22b573"*/}}>
          <div className='ui container'>
            <div className='ui text container no-marg aligned center' style={{textAlign: "center"}}>
              <div className="section-number">1</div>
              <h1>Zoom sur les joueurs de légende</h1>
            </div>
          </div>
          <div className='ui container'>
            <div className='ui text container no-marg'>
              <p className="ta lead">Vivamus ut ante auctor, sagittis leo ultrices, facilisis diam. Quisque dui nulla, mollis eu convallis ut, pretium nec leo. Phasellus pharetra elit a aliquam commodo. Duis arcu ipsum, tempus id purus elementum, pulvinar vestibulum justo. Vestibulum scelerisque egestas nunc in dictum. Mauris eu purus a lectus ornare gravida.</p>
              <p>Vestibulum non dolor vitae felis ultricies auctor at sodales nulla. Nullam posuere, nisi id lacinia fermentum, enim lectus pharetra nisi, eu pretium urna neque euismod lorem. Fusce felis ligula, ullamcorper quis placerat eu, aliquet aliquam lacus. Curabitur pulvinar nunc nec risus condimentum, in sodales massa posuere. Sed pellentesque consectetur turpis, non pulvinar diam sodales eget. Sed id felis nibh. Fusce finibus tortor ex, id aliquet dolor sodales et. Etiam sollicitudin tristique nunc, ut vulputate felis feugiat congue. Proin libero velit, sodales tincidunt tortor et, venenatis euismod nibh. Nullam est ligula, sollicitudin imperdiet mattis at, lacinia quis sapien. Ut vel elit purus. Duis sed consectetur enim. Sed posuere enim id lacus mollis, vitae sagittis neque ornare. Integer maximus nunc sit amet orci scelerisque, vel pellentesque sem egestas. Fusce lacinia nec lacus nec dictum.</p>
              <p>Proin arcu nisl, ultrices sed cursus sit amet, volutpat vel ligula. Vestibulum bibendum augue eu efficitur finibus. Morbi hendrerit rutrum porttitor. Sed at lorem bibendum, placerat ante sit amet, ultrices elit. Curabitur id lacus lorem. Cras a egestas neque. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
              <p>Nullam lobortis ornare diam et efficitur. In accumsan tincidunt dictum. Duis a justo ac orci finibus vulputate. Donec auctor arcu sit amet tempor scelerisque. Maecenas ac elit eget lacus ultricies efficitur. Donec tempus blandit imperdiet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce a sapien lectus. Mauris congue sapien sed sem venenatis, at efficitur erat lobortis. Etiam fringilla malesuada tellus vitae molestie. Phasellus dapibus eleifend tristique.</p>
              
              <img className="ui fluid image" src={require("./images/graph-invert-13.png")} />

              <p>Donec dapibus consectetur lectus, sollicitudin ultrices neque. Donec lobortis massa lacus, sit amet egestas elit dictum ut. Nam dignissim aliquam pellentesque. Donec mauris tellus, pretium quis libero sit amet, posuere dictum purus. Nulla facilisi. Curabitur sed blandit sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed id dictum nibh. Vestibulum elementum faucibus nisi sed placerat. Integer quam tellus, rutrum sit amet neque eget, eleifend volutpat mi.</p>
              <p>Curabitur ut augue dignissim, dignissim arcu vitae, rhoncus est. Ut metus magna, feugiat quis sagittis non, mollis et orci. Nunc dignissim rutrum enim, at luctus odio condimentum sed. Nam convallis justo quis eros euismod dignissim vel vulputate diam. Aliquam molestie, elit condimentum tincidunt faucibus, mi leo dignissim erat, vitae varius metus urna quis felis. Sed non elementum purus. Proin eget pharetra lorem. Morbi quis faucibus massa. Phasellus euismod bibendum iaculis. Maecenas a lacinia turpis, et rutrum magna. Nullam tincidunt dui euismod nisi tempor, at porttitor metus commodo.</p>
              <p>Nunc nec dictum mauris. Donec sit amet est sed massa elementum venenatis at at ex. Donec et libero eu massa facilisis vehicula. Sed fermentum elit arcu, at dapibus neque suscipit quis. Etiam placerat congue nisi, a porta mauris tincidunt sit amet. In sed odio vel libero ultricies aliquam nec at diam. Donec venenatis dui sit amet pretium elementum. Praesent gravida eros ut felis placerat, ut viverra lectus aliquet. Mauris lobortis efficitur justo eget eleifend. Duis sodales ex sed nibh convallis, vitae congue diam commodo. Praesent finibus a neque vitae dapibus. Nulla vehicula sed dolor ultricies facilisis. Praesent ultricies mauris vitae eros dapibus suscipit. Etiam non elementum risus. In ex metus, consectetur et auctor sed, efficitur quis neque.</p>
              <p>Maecenas luctus facilisis magna non commodo. In faucibus neque non nunc tristique finibus sit amet nec nisi. Nunc tincidunt nisl tortor, id convallis urna maximus eu. Mauris blandit nunc et lorem gravida faucibus. Duis condimentum quam quis ex vehicula, vel dictum nunc laoreet. Sed vitae faucibus quam, ut cursus metus. Sed egestas eros vel tortor imperdiet volutpat. Praesent semper lacus non neque iaculis, at convallis felis luctus. Fusce pellentesque dolor velit, congue viverra mauris maximus id. Nam maximus porttitor efficitur. Duis suscipit ante vitae mattis iaculis. Pellentesque condimentum luctus elit, sit amet pellentesque felis accumsan sed. Morbi eu egestas lorem. Vivamus laoreet elit eu maximus rhoncus. Sed sagittis quam ut nisi pharetra vulputate. Praesent ex justo, gravida nec tincidunt ornare, pharetra eget dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut sed.</p>
            </div>
          </div>
        </main>
        <main className='ui vertical very fitted segment text-chapter'>
          <div className='ui container'>
            <div className='ui text container no-marg aligned center' style={{textAlign: "center"}}>
              <div className="section-number">2</div>
              <h1>La Suisse et le mondial</h1>
            </div>
          </div>
          <div className='ui container'>
            <div className='ui text container no-marg'>
              <p class="ta lead">Nous avons analysé plus d'<b>un siècle de sélections nationales</b>. De 1908 à 2018, voici ce que l'évolution de l'équipe de Suisse nous apprend.</p>
              <p>Donec aliquam luctus velit quis ultricies. In lectus purus, efficitur eget gravida sit amet, vulputate in est. Suspendisse in lectus et risus fringilla dictum vitae quis nunc. Aliquam placerat, neque id pulvinar scelerisque, orci tortor consectetur dolor, vitae pretium metus mauris sit amet dui. Proin placerat rhoncus tortor. Curabitur leo orci, lobortis id sagittis eget, accumsan eget mi. Nulla neque risus, placerat nec eros at, ornare vulputate elit. Etiam id urna ac neque vestibulum maximus. Phasellus condimentum blandit elit pellentesque pulvinar. Vivamus convallis odio vitae leo imperdiet convallis. Suspendisse congue lobortis massa vitae eleifend. Aenean in urna libero.</p>
            </div>
          </div>

          <div className='ui container'>
            <div className='ui text container no-marg'>
              <h2>Le joueur type</h2>
              <p>Sed sit amet lacinia neque. Ut eget urna id augue viverra maximus. Curabitur consequat massa elit, sit amet fermentum leo scelerisque ut. Quisque leo turpis, posuere vitae mauris at, hendrerit hendrerit diam. Donec at faucibus sem. Maecenas et rhoncus diam. Maecenas id nunc sed eros imperdiet feugiat. Mauris eu rutrum enim. Cras vel odio a leo venenatis facilisis vel quis lacus. Phasellus hendrerit condimentum malesuada.</p>
              <img className="ui fluid image" src={require("./images/joueur-03.png")} />
              <p>Curabitur consequat massa elit, sit amet fermentum leo scelerisque ut. Quisque leo turpis, posuere vitae mauris at, hendrerit hendrerit diam. Donec at faucibus sem. Maecenas et rhoncus diam. Maecenas id nunc sed eros imperdiet feugiat. Mauris eu rutrum enim.</p>
            </div>
          </div>  

          <div className='ui container'>
            <div className='ui text container no-marg'>
              <h2>Devenir titulaire</h2>
              <p>Sed sit amet lacinia neque. Ut eget urna id augue viverra maximus. Curabitur consequat massa elit, sit amet fermentum leo scelerisque ut. Quisque leo turpis, posuere vitae mauris at, hendrerit hendrerit diam. Donec at faucibus sem. Maecenas et rhoncus diam. Maecenas id nunc sed eros imperdiet feugiat. Mauris eu rutrum enim. Cras vel odio a leo venenatis facilisis vel quis lacus. Phasellus hendrerit condimentum malesuada.</p>
            </div>
          </div>  

          <div className='ui container'>
            <img className="ui fluid image" src={require("./images/graph1-09.png")} />
          </div>

          <div className='ui container'>
            <div className='ui text container no-marg'>
              <p>Curabitur dapibus dictum faucibus. Nunc elit mauris, ornare vel ligula id, lacinia dictum ipsum. Vestibulum mollis enim eget lacus placerat tincidunt. Ut vitae hendrerit nibh. Vestibulum in elementum purus. Maecenas dignissim felis ante, vitae commodo lacus hendrerit vel. Donec tempus augue quis enim semper, eu placerat eros aliquet. Donec pharetra vehicula aliquam. Maecenas at porta purus. Ut urna nisl, vulputate venenatis mollis vel, ultrices non nibh. Curabitur lacus justo, laoreet sodales gravida ac, sollicitudin vitae felis. Proin malesuada est massa, ut fermentum magna tempus sit amet. Morbi blandit scelerisque ex, at venenatis magna sodales id. Vestibulum varius nunc et nulla cursus, in consequat elit aliquet. In vulputate, risus non cursus viverra, risus ipsum efficitur sem, vitae egestas nunc purus vitae lorem. Etiam elit velit, vehicula eget pellentesque eu, placerat at metus.</p>
              <p>Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent quam tellus, finibus quis dictum quis, feugiat vel nulla. Morbi porta mi a tempus euismod. Integer et libero turpis. Sed eu magna venenatis, dapibus tortor vel, bibendum quam. Nunc non nibh nec felis ultricies egestas eget eu lectus. Vivamus at lobortis libero. Nullam vel aliquet nibh.</p>
            </div>
          </div>

          <div className='ui container'>
            <div className='ui text container no-marg'>
              <h2>Le plus beau goal de l'équipe suisse</h2>
              <p>Sed sit amet lacinia neque. Ut eget urna id augue viverra maximus. Curabitur consequat massa elit, sit amet fermentum leo scelerisque ut. Quisque leo turpis, posuere vitae mauris at, hendrerit hendrerit diam. Donec at faucibus sem. Maecenas et rhoncus diam. Maecenas id nunc sed eros imperdiet feugiat. Mauris eu rutrum enim. Cras vel odio a leo venenatis facilisis vel quis lacus. Phasellus hendrerit condimentum malesuada.</p>
            </div>
          </div>

          <div className='ui container' style={{perspective: '816px'}}>
            <img className="ui fluid image" style={{transform: 'rotatex(50deg)'}} src={require("./images/best_goal_1-08.png")} />
          </div>

          <div className='ui container'>
            <div className='ui text container no-marg'>
              <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec lobortis mauris vitae leo condimentum pretium. Sed pharetra orci nulla, at suscipit est posuere pretium. Cras lorem sem, cursus et libero ut, iaculis tincidunt felis. Sed convallis felis ac sem maximus commodo. Quisque convallis, odio id tempus ornare, justo felis tristique dui, eget consequat mi quam vel velit. Vestibulum varius arcu eget tellus convallis, ac condimentum dui ultrices.</p>
              <p>Aliquam at est sed leo auctor pretium eu eu nibh. Fusce lobortis ex id massa luctus efficitur. Phasellus convallis augue vel est tincidunt accumsan. Curabitur quis suscipit dolor, et rutrum nibh. Suspendisse tellus nibh, gravida ut vestibulum in, tempor vitae quam. Donec egestas, sem eu interdum imperdiet, urna libero vehicula nulla, a rhoncus nibh ipsum eget purus. Nullam id ante at tortor venenatis commodo ac tristique purus. Nunc vestibulum risus in nunc molestie, eget luctus nibh tempus. Phasellus sagittis, orci eu finibus tempus, arcu nisl convallis augue, euismod auctor augue dui vitae arcu. Pellentesque malesuada, enim sit amet consectetur fermentum, neque dolor commodo felis, quis viverra felis neque in augue. Duis elementum malesuada dolor, ut ultrices lectus cursus sit amet.</p>
              <p>Nunc tempus dolor nisi, nec iaculis arcu tempus a. Vestibulum luctus sem ut feugiat imperdiet. In id pulvinar orci, at tempus lectus. Nullam nibh tellus, iaculis quis pharetra vitae, euismod vitae nisl. Fusce felis mauris, sodales eu lobortis et, euismod a neque. Donec quam felis, aliquam eu maximus sit amet, luctus ac massa. Quisque vel finibus tellus. Vivamus pharetra, leo id cursus egestas, nunc mauris sagittis est, sit amet feugiat nisl tellus non eros. Nulla vestibulum porttitor sapien, ac ultricies dui rhoncus ut. Phasellus mattis quam non urna varius, a ultricies sem tempor. Nullam eleifend magna mattis, tincidunt dolor nec, posuere arcu. Nunc et dolor vestibulum, sodales dolor nec, dignissim massa.</p>
              <p>Vivamus tristique dapibus maximus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Integer at ultricies nisi. Mauris eget lectus dolor. Cras volutpat leo vitae nibh consequat, ut iaculis ante imperdiet. Vestibulum commodo mattis cursus. Pellentesque non leo mattis, rhoncus ex sed, feugiat erat.</p>
              <p>Aliquam facilisis, ante sit amet accumsan faucibus, lectus nisi fringilla tortor, non consectetur odio tortor et quam. Sed eget mauris cursus, venenatis ligula vitae, condimentum turpis. Curabitur ultrices, neque eu lobortis ornare, diam magna auctor arcu, quis feugiat mauris nibh sit amet elit. Nullam suscipit laoreet ex, eget sodales arcu aliquet ac. Maecenas vitae egestas erat, ac ultricies sem. Curabitur in tortor sed ipsum condimentum sagittis. Mauris convallis, ipsum nec aliquet molestie, erat enim rhoncus ante, eu imperdiet urna nunc vel sem. Etiam hendrerit vestibulum mollis. Vestibulum vitae pretium augue. Maecenas et faucibus arcu. Ut gravida viverra tempus.</p>
              <p>Donec condimentum mollis nisi. Ut ac tempor elit, sed gravida eros. Donec pretium augue nec rhoncus interdum. Aliquam ante ipsum, pellentesque at pulvinar nec, porttitor varius dui. Vestibulum malesuada nunc nibh, id ultrices sapien lobortis eu. Phasellus vitae tortor elit. Curabitur commodo mauris lectus, sed ornare nulla eleifend a. Nunc tortor turpis, tristique nec tincidunt et, venenatis ac leo. Curabitur feugiat lectus sit amet tellus iaculis consequat. Maecenas mattis finibus libero, et facilisis diam posuere a. Pellentesque et turpis ligula. Cras pretium, justo id posuere sodales, magna orci porta magna, in porttitor leo justo non tortor.</p>
              <p>Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce tempor luctus diam, sit amet viverra est dictum non. Maecenas viverra, velit nec elementum ultricies, nibh quam aliquet sem, at commodo ligula sapien porta enim. Nam maximus ut felis et feugiat. Maecenas blandit sed felis ut egestas. Aliquam commodo eu ipsum vitae fringilla. Duis gravida sit amet odio ut feugiat. Ut lacus ante, auctor at pharetra sollicitudin, hendrerit quis ante. Pellentesque vel enim quis ligula hendrerit varius. Cras nec nunc maximus, pellentesque leo sit amet, mollis metus. Sed felis justo, suscipit quis ullamcorper vel, venenatis ac lorem. Mauris elementum est vitae orci sodales, a sagittis diam dictum. Aenean in fermentum nisl. Pellentesque dui lorem, ultrices sed mi at, interdum egestas quam. Aenean vitae lectus at felis scelerisque ultrices at nec risus. Aliquam eleifend faucibus mattis.</p>
              <p>Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris convallis leo ut tempus euismod. Phasellus feugiat laoreet massa nec lacinia. Quisque facilisis sodales purus in efficitur. Nullam eleifend efficitur faucibus. Suspendisse mollis nunc eget sagittis mattis. Proin vel dolor congue, faucibus orci et, mollis ex. Proin sem orci, accumsan commodo lacinia ac, commodo id risus. Proin luctus, ipsum non lacinia pellentesque, lorem nunc tempus leo, nec porttitor magna nisl vitae nibh.</p>
              <p>In tristique pretium odio, et pharetra quam auctor blandit. Pellentesque vulputate, sem in dignissim egestas, metus nulla maximus magna, eu pretium libero lectus nec mi. Integer pellentesque turpis vitae augue finibus auctor. Quisque tempor sodales metus quis sagittis. Curabitur vestibulum tortor ac mauris molestie, vel imperdiet ante posuere. Phasellus nulla metus, vulputate at est eu, ultrices efficitur felis. Aenean ut eleifend dolor. Aliquam viverra eros eget porta finibus.</p>
              <p>Nunc tincidunt elementum tincidunt. Donec vulputate lorem ut dolor placerat luctus. Suspendisse tincidunt eu tellus congue scelerisque. Nulla ornare sem dui, at ullamcorper dolor feugiat vel. Etiam eu iaculis enim, ut malesuada tellus. In volutpat nibh eget sagittis interdum. Etiam porta arcu ut venenatis consequat. Nulla nisl nunc, rhoncus id elementum ut, venenatis sit amet nunc. Proin ac sem ex. Ut a urna ex. Etiam ac urna sem. Morbi suscipit, sapien ut tempor laoreet, nibh massa luctus odio, eget viverra erat libero ut metus. Cras rhoncus eget neque ac fringilla.</p>
              <p>Aenean feugiat tellus in ipsum tempor accumsan. Donec luctus urna massa, sed blandit eros malesuada eget. Nunc maximus velit sit amet erat ornare, a sodales tortor vulputate. Praesent elit ante, blandit ut finibus at, dictum quis lorem. Morbi tristique ante eu cursus fermentum. Nulla facilisi. Sed tellus nulla, rhoncus id tincidunt nec, ornare vitae metus.</p>
              <p>Nulla ac rhoncus sem. Integer turpis ex, varius in dui accumsan, euismod euismod ligula. Nam ac tincidunt justo. Maecenas sit amet pellentesque elit. Etiam ac turpis id lacus ultricies ornare consectetur non velit. Aenean elementum massa nunc.</p>
            </div>
          </div>
        </main>

        <footer className='ui vertical segment'>
          <div className='ui container'>
            <div className='ui two column divided stackable grid'>
              {/*<div className='center aligned row teaser-section'>
                <a href='https://interaktiv.tagesanzeiger.ch'>
                  <img
                    src='https://interaktiv.tagesanzeiger.ch/inline-teaser.gif'
                    className='portfolio-teaser'
                  />
                </a>
              </div>*/}
              <div className='stretched aligned row'>
                <div className='column'>
                  <table className='ui definition very basic small infographic table'>
                    <tbody>
                      <tr>
                        <td>Texte et recherches</td>
                        <td>DED WCH</td>
                      </tr>
                      <tr>
                        <td>Concept visuel et illustrations</td>
                        <td>
                          DED WCH
                        </td>
                      </tr>
                      <tr>
                        <td>Publié le</td>
                        <td>
                          <TimestampFormatter timestamp={1525222800 - 3600} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className='column'>
                  <FeedbackMessage
                    question="Vous voulez communiquer un renseignement ou vous avez repéré une erreur?"
                    call="Envoyez-nous un "
                    mail="message"
                    mailTo='interaktiv@tages-anzeiger.ch' />
                  <div className='ui fluid share container'>
                    <PolymorphicShareButtons
                      articleId='20417500'
                      hashtags={['TAGrafik', 'ddj']}
                      displayType={displayTypes.VERTICAL_BUTTONS}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </div>
    );
  }
}

export default App;
