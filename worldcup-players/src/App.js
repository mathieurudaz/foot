import React, { Component } from 'react';
import scrollToComponent from 'react-scroll-to-component';
import Player from './Player';
import Question from './Question';
import PlayersDb from './data/data.json';
import Masthead from '@ta-interaktiv/react-masthead'
import Scoreboard from './Scoreboard';
import Inlinescore from './Inlinescore';
import Pronocard from './Pronocard';
import GoalAnimation from './GoalAnimation';

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
import '@ta-interaktiv/semantic-ui/semantic/dist/components/rail.css'

import './App.css';
import './videoWrapper.css'


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
    "answers": ["Il ne faut rien laisser passer", "La meilleure attaque c'est la défense", "Il faut trouver le juste milieu", "Il faut toujours aller de l'avant"]
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
    this.start = this.start.bind(this);
    this.questionComponents = []
  }

  start(){
    // Scroll to the first question
    setTimeout(() => {scrollToComponent(this.questionComponents[0])}, 250)
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
      //console.log( PlayersDb )
  }

  render() {
    return (
      <div className={"app style-" + this.state.currentTemplate}>
        <Masthead
          inverted={true}
          defaultLanguage="fr"
          mediaName='24heures'
          homepage='//www.24heures.ch'
          articleId='29787437'
          fullMediaName='24 heures'
          hashtags={['24heuresch']} />
        <div className="ui vertical very fitted title">
          <div className='ui container center aligned'>
            <div className='ui'>
              <div>
                <img className="intro-image" src={require("./images/player.png")} alt="" />
                <h2 className="surtitre">Coupe du monde 2018 </h2>
                <h1>Quel <span className="title-special">joueur de légende</span> êtes-vous?</h1>
              </div>
              <div className="start-block">
                <div className="start-touch" onClick={this.start}>Commencer</div>
                <a className="shortcut" href="#section-1">Lire directement notre dossier</a>
              </div>
            </div>
          </div>
        </div>
        <div className='questions'>
          { questions.map((question, index) => {
              return (
                      <div className="question-container" id={"question-"+index} key={index}>                          
                        <Question
                          key={index}
                          id={index}
                          questionMax={questions.length}
                          ref={Question => {this.questionComponents[index] = Question;}}
                          onAnswered={this.answeredHandler}
                          title={question.title.toUpperCase()}
                          answers={question.videoAnswers ? question.videoAnswers : question.answers} />
                        <div className="question-skip" onClick={() => setTimeout(() => {scrollToComponent(this.player, {align:"top"})}, 200)}>Passer les prochaines questions</div>
                      </div>
                      )
              })
          }
        </div>
        <Player
          id="0"
          exactMatch={this.state.exactMatch}
          player={this.state.matchedPlayer}
          answers={this.state.answers}
          ref={Player => {this.player = Player}} />
        
        { /* First section */ }
        <main id="section-1" className='ui vertical very inverted fitted segment text-chapter'>
          <div className="downbait inverted"></div>
          <div className='ui container'>
            <div className='ui text container no-marg aligned center' style={{textAlign: "center"}}>
              <img className="ui fluid image section-stars" src={require("./images/stars_colorized_shadow.png")} alt="" />
              <h1>Pour l’éternité, être un joueur de légende</h1>
              <div className="authors"><b>Texte:</b> Daniel Visentini</div>
            </div>
          </div>
          <div className='ui container'>
            <div className='ui text container no-marg' style={{position:"relative"}}>
              <p className="ta lead">
                C’est le moment préféré de tous les gamins du monde. Après avoir soigneusement délimité, à pas de
                fourmi, deux poteaux symbolisés par des tas de vêtements soigneusement roulés en boule, le décor prend
                forme: c’est un terrain de foot qui dessine ses contours fantastiques et sur lequel se jouera une finale de
                Mondial, d’Euro ou de Ligue des champions. Sans public, sans arbitre, sans stade autour, peu importe.
                Mais avec bientôt deux équipes fabuleuses composées des plus extraordinaires joueurs de tous les
                temps, puisque chaque gosse sera la star qu’il veut l’espace de ce match.
              </p>

              <p>
                Alors d’un seul coup, il y a là Pelé qui ressuscite Cruyff le temps d’une passe magique; il y a Maradona qui
                défie Yachine par-delà les âges; il y a Platini et Puskas, main dans la main, qui déboulent ensemble pour
                affronter Beckenbauer, ou encore le «docteur» Socrates, drapé dans son élégance féline, qui voit Zidane se
                démarquer avant de se raviser pour alerter Baggio, mieux placé; tiens, il y a même là-bas Shaqiri et
                Chapuisat et Crisitiano Ronaldo qui s’associent pour déconcerter Iker Casillas, pendant que Van Basten
                demande le ballon. Il y en a tant d’autres, tous convoqués, tous immortels. Tous des légendes, qu’une
                ribambelle de gamins joyeux incarne pour toujours, à chaque fois qu’une cage s’improvise sur un talus et
                que chacun annonce aussitôt, fièrement, qui il a choisi d’être à l’intérieur de cette parenthèse enchantée.
              </p>

              <aside className='ui vertical very fitted segment widescreen hidden large screen hidden small' style={{marginBottom: '1em'}}>
                <div className='story-hint inverted'>
                  <div className='icon-container'>
                    <div className="section-number small" style={{ backgroundColor: "#ffce4d" }}>2</div>
                  </div>
                  <div className='hint-container'>
                    Tout savoir sur <b>la Suisse et le Mondial</b>, à découvrir plus bas <nobr>
                    <a href="#section-2" className='pseudo-link'>ou en cliquant ici</a></nobr>.
                  </div>
                </div>
              </aside>

              <aside className='ui right rail computer or lower hidden' style={{top: '7%'}}>
                <div className='story-hint inverted'>
                  <div className='icon-container'>
                    <div className="section-number small" style={{ backgroundColor: "#ffce4d" }}>2</div>
                  </div>
                  <div className='hint-container'>
                    Tout savoir sur <b>la Suisse et le Mondial</b>, à découvrir plus bas <nobr>
                    <a href="#section-2" className='pseudo-link'>ou en cliquant ici</a></nobr>.
                  </div>
                </div>
              </aside>

              <img className="ui fluid image" src={require("./images/dataviz_legends-maradona.png")} alt="" />

              <p>
                Une légende du football c’est quoi, sinon ce nom qu’un gosse s’approprie, comme s’il devait revêtir par
                cette douce usurpation d’identité tous les attributs de son héros? Bien sûr, le talent façonne
                l’hagiographie, sculpte le mythe, le précède en le rendant possible. Mais il y a autre chose, un supplément
                d’âme, sûrement, pour élever celui qui est déjà star au firmament des élus. Les gloires et les
                accomplissements inscrivent sur le papier un palmarès comptable qui se partage avec tout un contingent.
                Un seul pourtant, souvent, s’échappe de l’inventaire pour peupler l’imaginaire collectif. C’est injuste. On
                dit la France de Zidane ou de Platini, l’Argentine de Maradona ou de Messi, le Portugal de Cristiano
                Ronaldo ou d’Eusébio, le Brésil de Pelé ou de Neymar, l’Allemagne de Beckenbauer ou de Matthäus: à
                chacun sa génération, mais pour tous la distinction.
              </p>

              <p>
                Devenir une légende, c’est sans doute être meilleur que les autres. Mais pour beaucoup de raisons, dont
                certaines débordent le cadre du seul terrain. Si le football est une tragédie grecque — unité de temps,
                unité de lieu, unité d’action —, il y a, en marge de l’acteur, l’homme derrière le rôle. Tenir sa place, dans le
                théâtre du spectacle programmé, lors d’un Mondial ou en club, c’est la tâche de chacun. Occuper la scène
                jusqu’à en éclipser les autres, pour le bonheur, paradoxalement, de tous les siens, c’est le destin des
                génies, de ceux qui entrent justement dans la légende. Mais comment?
              </p>

              <p>
                C’est Beckenbauer qui termine sa demi-finale du Mondial 1970 contre l’Italie le bras bandé en écharpe,
                blessé durant de folles prolongations, meurtri mais debout, éliminé mais déjà «Kaiser», son futur surnom.
                C’est le jeune Edson Arantes do Nascimento, autrement dit Pelé, 17 ans, qui emmène le Brésil vers sa
                première Coupe du monde en 1958, en Suède; il en gagnera trois, seul joueur à cette altitude, dont celle
                de 1962 où il ne jouera pratiquement pas (un match contre le Mexique et 25 minutes avant de se blesser
                contre la Tchécoslovaquie). Au Chili, c’est grâce à Garrincha, ce «petit oiseau» aux pattes bizarres, que le
                Brésil s’impose, mais l’histoire a la mémoire sélective quand on touche à ses légendes, alors pour tous,
                Pelé l’a aussi gagné, ce Mondial-là…
              </p>

              <aside className='ui vertical very fitted segment widescreen hidden large screen hidden small' style={{marginBottom: '1em'}}>
                <div className='story-hint inverted'>
                  <div className='icon-container'>
                    <div className="section-number small" style={{ backgroundColor: "#ffce4d" }}>2</div>
                  </div>
                  <div className='hint-container'>
                    Les souvenirs des <b>vieilles gloires</b> de l'équipe de Suisse, à découvrir plus bas <nobr>
                    <a href="#section-2" className='pseudo-link'>ou en cliquant ici</a></nobr>.
                  </div>
                </div>
              </aside>

              <aside className='ui right rail computer or lower hidden' style={{top: '36%'}}>
                <div className='story-hint inverted'>
                  <div className='icon-container'>
                    <div className="section-number small" style={{ backgroundColor: "#ffce4d" }}>2</div>
                  </div>
                  <div className='hint-container'>
                    Les souvenirs des <b>vieilles gloires</b> de l'équipe de Suisse, à découvrir plus bas <nobr>
                    <a href="#section-2" className='pseudo-link'>ou en cliquant ici</a></nobr>.
                  </div>
                </div>
              </aside>

              <img className="ui fluid image" src={require("./images/dataviz_legends-pele.png")} alt="" />

              <p>
                La légende, ce n’est pas que la bravoure indicible ou le récit merveilleux, c’est aussi la geste. C’est
                l’exceptionnel talent de Maradona, qui porte l’Argentine à lui tout seul au titre en 1986 au Mexique. Mais
                avec cette dualité brutale en quart de finale contre l’Angleterre: il triche en marquant un but de la main
                que seul l’arbitre ne voit pas - la fameuse «main de Dieu» -, avant d’inscrire l’un des plus fabuleux buts
                de l’histoire, passant en revue toute l’équipe anglaise dans un solo inouï de virtuosité technique. C’est
                toujours ce même Maradona, star ultime mais génie froissé, qui quittera la sélection argentine lors de la
                World Cup 94 aux États-Unis, convaincu de dopage. Il faut croire qu’entre le bon Dieu et le mauvais
                démiurge, la cohabitation n’est pas toujours facile.
              </p>

              <p>
                Demandez à Zinédine Zidane. Le héros de toute la France en 1998, pour ce titre mondial qu’il offre aux
                Bleus avec ses deux têtes en finale contre le Brésil. On en oublierait presque son expulsion pour une
                réaction épidermique dès le deuxième match de la compétition, contre l’Arabie saoudite. Ce vilain travers
                le suit jusqu’en 2006, lors de la finale contre l’Italie, à Berlin: c’est le «coup de boule» sur Materazzi,
                durant les prolongations, avant des tirs au but qu’il suivra des vestiaires, après avoir été logiquement
                expulsé. Il avait pourtant commencé par ouvrir le score, sur un penalty qu’il décidait historique, puisqu’il
                avait choisi une «Panenka» (un tir risqué au milieu en lob, du nom du joueur tchécoslovaque qui l’a
                inventé, une autre légende pour cette seule inspiration) afin de porter sa griffe définitive sur son
                parcours: entre l’orgueil et la vanité, le génie vacille aussi. Comme pour Maradona, le meilleur des
                instincts côtoie le pire, jusqu’au dénouement «inexcusé» que l’on sait face à Materazzi.
              </p>

              <aside className='ui vertical very fitted segment widescreen hidden large screen hidden small' style={{marginBottom: '1em'}}>
                <div className='story-hint inverted'>
                  <div className='icon-container'>
                    <div className="section-number small" style={{ backgroundColor: "#ffce4d" }}>2</div>
                  </div>
                  <div className='hint-container'>
                    Le <b>match le plus fou</b> de l'équipe de Suisse, à découvrir plus bas <nobr>
                    <a href="#section-2" className='pseudo-link'>ou en cliquant ici</a></nobr>.
                  </div>
                </div>
              </aside>

              <aside className='ui right rail computer or lower hidden' style={{top: '67%'}}>
                <div className='story-hint inverted'>
                  <div className='icon-container'>
                    <div className="section-number small" style={{ backgroundColor: "#ffce4d" }}>2</div>
                  </div>
                  <div className='hint-container'>
                    Le <b>match le plus fou</b> de l'équipe de Suisse, à découvrir plus bas <nobr>
                    <a href="#section-2" className='pseudo-link'>ou en cliquant ici</a></nobr>.
                  </div>
                </div>
              </aside>

              <img className="ui fluid image" src={require("./images/dataviz_legends-zidane.png")} alt="" />

              <p>
                Mais on pardonne tout aux légendes. Il y a comme une grâce qui les enveloppe, dont l’imperfection même
                garantit l’éternité. Après tout, ce qui s’inscrit en marge de la performance pure, pour de bonnes ou de
                mauvaises raisons, n’existe que pour ramener un instant tous ces génies à hauteur d’homme, avant qu’ils
                ne s’évadent encore au détour d’un dribble improbable, d’une volée irréelle, d’une feinte vertigineuse.
              </p>

              <p>
                Cet été et après encore, au-delà de ce Mondial russe, les stars deviendront légendes dans un cortège où
                personne ne chasse l’autre. Et l’on peut déjà deviner les gamins de demain, réunis autour du ballon, juste
                avant leur match fantastique mais si réel, plus Cristiano que Ronaldo, plus Neymar que Zico, plus Shaqiri
                que Sutter, plus De Bruyne que Pfaff, ou alors par Hazard. Il suffira d’un geste, d’un éclat, d’un
                miroitement pour que d’autres encore se joignent à cette danse.
              </p>

              <p>
                Être une légende, c’est peut-être susciter cette émotion-là, qui allume les yeux des enfants, grands et
                petits.
              </p>
            </div>
          </div>
        </main>

        { /* Last section */ }
        <main id="section-2" className='ui vertical very fitted segment text-chapter'>
          <div className="downbait"></div>
          <div className='ui container'>
            <div className='ui text container no-marg aligned center' style={{textAlign: "center"}}>
              <img className="ui fluid image section-stars" src={require("./images/stars_colorized.png")} alt="" />
              <h1>La Suisse et le mondial</h1>
              <div className="authors"><b>Textes:</b> Renaud Tschoumy, Frédéric Thomasset</div>
            </div>
          </div>
          <div className='ui container'>
            <div className='ui text container no-marg'>
              <p className="ta lead">
                Quelle est la taille moyenne d’un joueur de l’équipe de Suisse? Quel canton, quel club, sont les plus
                grands pourvoyeurs de la Nati? Vous souvenez-vous de chaque maillot, chaque campagne en Coupe du monde?
                Des matches les plus fous, les plus prolifiques, comme des défaites les plus dures à avaler?
              </p>
              <p>
                Autant de questions - et bien d’autres encore - auxquelles nous avons décidé de répondre, en analysant
                les données disponibles sur l’équipe nationale. Une démarche exhaustive, couvrant <b>plus d’un siècle de
                football</b> et pas moins d’un <b>demi-millier de joueurs</b>. Une autre manière de raconter la grande histoire de
                la Nati, et de revoir ses gammes avant le coup d’envoi de la Coupe du monde en Russie.</p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">1</div>
                <h2>Le joueur type</h2>
              </div>
              <p>
                Une compilation de statistiques a permis de définir les contours et de cerner les traits
                de <b>l’international helvétique de référence</b>.
                Si vos parents avaient été Zurichois, s’ils s’étaient appelé Müller et s’ils vous
                avaient prénommé Walter, vous auriez eu plus de chance que les autres d’être
                appelé en équipe de Suisse!
              </p>
              <img className="ui fluid image" src={require("./images/joueur-03.png")} alt="" />
              <p>
                Ce nom et ce prénom sont en effet ceux que l’on
                retrouve le plus souvent dans l’historique des sélectionnés. Si vous aviez ajouté
                à cela une taille de 180 cm et une licence à Grasshopper, vous auriez
                définitivement été le <b>joueur parfait</b> pour l’équipe de Suisse.
              </p>
            </div>
          </div>  

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">2</div>
                <h2>Devenir titulaire</h2>
              </div>
              <p>
                Pour être sélectionné en équipe de Suisse, il vaut donc mieux être Zurichois.
                C’est en effet, et sans grande surprise, le canton de Zurich qui a fourni le plus
                de joueurs à l’équipe de Suisse depuis 1994 et son retour en phase finale.
              </p>
            </div>
          </div>  

          <div className='ui container computer or lower hidden'>
            <img className="ui fluid image" src={require("./images/dataviz_titulaire-desktop.png")} alt="" />
          </div>

          <div className='ui container widescreen hidden large screen hidden'>
            <img className="ui fluid image" src={require("./images/dataviz_titulaire-mobile.png")} alt=""/>
          </div>

          <div className='ui container'>
            <div className='ui text container no-marg'>
              <p>
                La base de données est parfois incomplète et il n’est pas toujours aisé de trouver des
                informations fiables sur les anciens internationaux. Des tendances se dégagent pourtant.
                <br/>Au fil des années, on constate ainsi que la taille des joueurs augmente. Avant 1944, la moyenne
                était de 175 cm. Elle est passée à 178 cm entre 1944 et 1980 puis à 182 cm après 1980.
                <br/>L’«espérance de vie» des joueurs en sélection est également en hausse. Logique dès lors
                qu’une carrière croît en même temps que le progrès s’exerce dans tous les domaines d’activité
                (entraînement, nutrition, préparation mentale et physique).</p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">3</div>
                <h2>Les souvenirs des vieilles gloires</h2>
              </div>
              <p>
                Sur le banc comme sur le terrain, ils ont été les acteurs et témoins privilégiés de la vie en Coupe du monde. De
                leurs campagnes américaine pour l’un, allemande pour l’autre, <b>le latéral droit Marc Hottiger</b> et <b>l’entraîneur assistant
                Michel Pont</b> ont ramené quelques maillots, des histoires de coup de tête, des anecdotes de coiffeur, les regrets d’une
                défaite, mais surtout le sentiment d’avoir participé à quelque chose d’unique.</p>
                <p>Avec un plaisir non dissimulé, et un amour
                profond du public suisse, <b>ils ont accepté d’ouvrir leurs boîtes à souvenirs</b>.
              </p>
            </div>
          
            <div className="ui stackable two column grid" style={{margin: "20px 0px 0px 0px"}}>
              <div className="column">
                <div className='videoWrapper' style={{marginTop: "20px"}}>
                  <iframe
                    className='externalNNIFrame'
                    src='https://www.lematin.ch/extern/videoplayer/videoplayer-nn.html?params=client@tagesanzeiger|videoId@339408|showLogo@1|autoStart@0|mute@0|showAds@false|previewPath@https://server025.newsnetz.tv/338508/frame-1-338508.jpg|platform@desktop'
                    allowFullScreen='true'
                    scrolling='no'
                    frameBorder='no'
                    title='Michel Pont video'
                  />
                </div>
                <p><b>2006: L'Énergie de Pont</b></p>
              </div>
              <div className="column">
                <div className='videoWrapper' style={{marginTop: "20px"}}>
                  <iframe
                    className='externalNNIFrame'
                    src='https://www.lematin.ch/extern/videoplayer/videoplayer-nn.html?params=client@tagesanzeiger|videoId@339410|showLogo@1|autoStart@0|mute@0|showAds@false|previewPath@https://server025.newsnetz.tv/338508/frame-1-338508.jpg|platform@desktop'
                    allowFullScreen='true'
                    scrolling='no'
                    frameBorder='no'
                    title='Marc Hottiger video'
                  />
                </div>
                <p><b>1994: Hottiger et le rêve américain</b></p>
              </div>
            </div>

          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">4</div>
                <h2>Les participations</h2>
              </div>
              <p>
                Il s’agit de la <b>onzième participation</b> de la Suisse à la phase finale. Non inscrite
                en 1930, elle a participé à six des sept tournois qui ont suivi (Italie 1934, France
                1938, Brésil 1950, Suisse 1954 en tant que pays organisateur, Chili 1962 et
                Angleterre 1966).
              </p>

              <p>
                S’ensuivit une longue période de disette (28 ans, soit six
                phases finales), jusqu’à la qualification des boys de Roy Hodgson (États-Unis
                1994).
              </p>

              <div className='ui container computer or lower hidden'>
                <img className="ui fluid image" src={require("./images/dataviz_participations-desktop.png")} alt="" />
              </div>

              <div className='ui container widescreen hidden large screen hidden'>
                <img className="ui fluid image" src={require("./images/dataviz_participations-mobile.png")} alt=""/>
              </div>

              <p>
                Absente en France en 1998, puis au Japon et en Corée du Sud en 2002,
                <b> la Suisse a, depuis, toujours réussi à se qualifier</b> (Allemagne 2006, Afrique du
                Sud 2010, Brésil 2014 et Russie 2018).
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc pronocards-container'>
            <div className='ui text container no-marg' style={{position:"relative"}}>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small inverted">5</div>
                <h2>En 1934, le premier match</h2>
              </div>

              <p>
                Qualifiée pour la Coupe du monde 1934 après un match nul contre la
                Yougoslavie et une victoire par forfait contre la Roumanie, qui avait aligné un
                joueur non sélectionnable, <b>la Suisse dispute son tout premier match de phase
                finale le 27 mai 1934 à Milan</b>, face aux Pays-Bas.
              </p>

              <Scoreboard score={[3,2]} teams={["Suisse", "Pays-Bas"]}/>

              <aside className='ui vertical very fitted segment widescreen hidden large screen hidden small' style={{marginBottom: '1em'}}>
                  <div className='story-hint quote'>
                    <div className='hint-container'>
                      <div>
                        <p>
                          Trello Abegglen fait feu de tout bois. Après avoir offert les deux premiers buts à
                          Kielholz, il inscrit lui-même le troisième.
                        </p>
                      </div>
                    </div>
                  </div>
              </aside>
              <aside className='ui right rail computer or lower hidden' style={{top: '30%'}}>
                  <div className='story-hint quote'>
                    <div className='hint-container'>
                      <div>
                        <p>
                          Trello Abegglen fait feu de tout bois. Après avoir offert les deux premiers buts à
                          Kielholz, il inscrit lui-même le troisième.
                        </p>
                      </div>
                    </div>
                  </div>
              </aside>

              <p>
                Le tournoi réunissant 16
                équipes, ce premier tour n’est autre qu’un huitième de finale. Les Néerlandais
                sont plus nombreux dans les gradins (7000, contre 2000 Suisses environ), mais
                inférieurs sur le terrain.
              </p>
              <p>
                Ce jour-là, Trello Abegglen fait feu de tout bois. Après
                avoir offert les deux premiers buts à Kielholz sur des services d’une précision
                folle (7e et 44e minutes), il inscrit lui-même le troisième but (72 e ). <b>La Suisse bat
                les Pays-Bas</b> <Inlinescore className="score" score={[3,2]} /> et se qualifie pour les
                quarts de finale, où elle sera battue par la Tchécoslovaquie, future finaliste
                (<Inlinescore className="score" score={[2,3]} />).
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">6</div>
                <h2>Le meilleur résultat</h2>
              </div>
              <p>
                La Suisse a atteint les <b>quarts de finale</b> à trois reprises. 
                Mais à cette époque, les phases finales de
                Coupe du monde ne regroupaient que <b>16 équipes</b>. Il était dès lors plus aisé de
                se qualifier pour les quarts de finale, ce que la Suisse n’a jamais réussi à faire
                depuis le passage à 24, puis 32 équipes.
              </p>

              <img className="ui fluid image" src={require("./images/dataviz_results.png")} alt="" />

              <p>
                Elle a été huitième de finaliste à trois
                reprises depuis son grand retour parmi l’élite. En <b>1994</b>, la Suisse était
                sèchement battue <Inlinescore className="score" score={[0,3]} /> par l’Espagne à Washington. En <b>2006</b>, face à l’Ukraine,
                c’est aux tirs au but qu’elle est éliminée (<Inlinescore className="score" score={[0,0]} /> après 120 minutes de jeu). Marco
                Streller, Tranquillo Barnetta et Ricardo Cabanas manquent tous leur affaire des

                onze mètres. Enfin, en <b>2014</b>, elle pousse l’Argentine de Lionel Messi aux
                prolongations. Elle encaisse l’ouverture du score (Di Maria) à la 118 e minute,
                Dzemaili manquant de peu arracher la séance de tirs au but (tête sur le poteau
                à la 120e).
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg' style={{position:"relative"}}>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">7</div>
                <h2>En 1954, le match le plus fou</h2>
              </div>
              {/*<div className="dateyear">1954</div>*/}
              <p>
                Il s’agit sans conteste du fameux quart de finale Suisse - Autriche, le <b>26 juin
                1954</b>. On est à Lausanne, et le stade de la Pontaise affiche complet (35&#39;000
                spectateurs).
              </p>
              <p>
                La Suisse inscrit trois buts (Ballaman, Hügi deux fois) en trois minutes,
                pour mener <Inlinescore className="score" score={[3,0]} /> à la 19e . Mais une commotion passagère (chute et coup de
                chaleur) prive Bocquet de sa lucidité. Totalement ailleurs, incapable de
                commander sa défense, il laisse son gardien se débattre seul face aux
                attaquants autrichiens.
              </p>
              {/*<Scoreboard score={[7,5]} teams={["Autriche", "Suisse"]} />*/}

              <aside className='ui vertical very fitted segment widescreen hidden large screen hidden small' style={{marginBottom: '1em'}}>
                  <div className='story-hint quote'>
                    <div className='hint-container'>
                      <div>
                        <p>
                          Une commotion prive Bocquet de sa lucidité. Incapable de commander sa défense,
                          il laisse son gardien Parlier se débattre seul.
                        </p>
                      </div>
                    </div>
                  </div>
              </aside>
              <aside className='ui right rail computer or lower hidden' style={{top: '50%'}}>
                  <div className='story-hint quote'>
                    <div className='hint-container'>
                      <div>
                        <p>
                          Une commotion prive Bocquet de sa lucidité. Incapable de commander sa défense,
                          il laisse son gardien Parlier se débattre seul.
                        </p>
                      </div>
                    </div>
                  </div>
              </aside>

              <img className="ui fluid image" src={require("./images/match-1954.jpg")} style={{margin: "20px 0px 30px 0px"}} alt="" />

              <p>
                Résultat: en neuf minutes, de la 25&nbsp;e à la 34&nbsp;e, l’Autriche
                inscrit cinq buts et renverse la vapeur! Ballaman réduit l’écart avant la pause
                (<Inlinescore className="score" score={[4,5]} /> à la 39&nbsp;e ) avant que Hügi
                n’inscrive son troisième but personnel (<Inlinescore className="score" score={[5,6]} /> à la
                60&nbsp;e ), mais la Suisse ne réussit pas à retourner la situation.
              </p>

              <p>
                Score final: <Inlinescore className="score" score={[7,5]} /> pour
                l’Autriche, qui prive la Suisse d’une demi-finale à domicile qui lui tendait les
                bras. Cette rencontre de légende est toujours dans le Livre des records: <b>jamais il
                n’a été marqué autant de buts (douze) en une seule rencontre de phase finale</b>.
              </p>
            </div>
          </div>

          <div className='ui container pronocards-container'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small inverted">8</div>
                <h2>Le plus beau goal</h2>
              </div>
              <p>
                Un choix forcément subjectif, mais on a opté pour le but de <b>Haris Seferovic </b>
                contre l’Équateur, à Brasilia, lors de l’entrée en lice de la Suisse dans le <b>Mondial
                2014</b>, au Brésil (<Inlinescore className="score" score={[2,1]} /> à la 93e minute).
              </p>
            </div>
            <GoalAnimation />
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">9</div>
                <h2>Le maillot à travers les âges</h2>
              </div>
              <p>
                Croix suisse blanche sur un maillot rouge: le graphisme des maillots de l’équipe
                de Suisse semble évident. Il y eut pourtant des exceptions.
              </p>
              <p>
                En 1990, la Suisse est sous contrat avec Blacky, qui propose une ligne novatrice.
                La croix suisse occupe la quasi-totalité du devant du maillot, qui plus est ornée
                de parements noirs. Scandale: comment peut-on jouer sans avoir le symbole du
                pays – qui plus est dénaturé – sur le cœur? C’est pourtant avec ce maillot que
                l’équipe de Suisse du renouveau (celle de Chapuisat, Knup, etc.) obtiendra ses
                premiers résultats de référence, avant de passer chez Lotto pour la campagne
                menant à la phase finale américaine de la World Cup 1994, puis chez Puma en
                1998.
              </p>

              <img className="ui fluid image" src={require("./images/dataviz_maillots.png")} alt="" />

              <p>
                En 2008, juste avant l’Euro qui se dispute en Suisse et en Autriche, c’est
                justement Puma qui déclenche la polémique au moment de la présentation du
                nouveau maillot: la croix suisse, qui est simplement suggérée par les traits du
                logo de l’Association suisse de football, est jugée «pas assez visible». C’est
                malgré tout avec cet équipement que la Suisse disputera «son» tournoi.
              </p>
              <p>
                Le drapeau suisse fera son retour sur le cœur pour la Coupe du monde 2010 en
                Afrique du Sud, le logo de l’ASF glissant sur le côté droit du maillot.
                Et puis, impossible de parler des maillots suisses sans rappeler l’épisode
                survenu le 19 juin 2016 contre la France, lors du dernier match de groupe de
                l’Euro: les shirts de Mehmedi, Embolo, Dzemaili et Xhaka avaient fini en
                lambeaux. Là, il ne s’agissait pas de graphisme, mais bien d’une erreur de
                fabrication, comme l’a reconnu Puma le lendemain.
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">10</div>
                <h2>Les romands</h2>
              </div>
              <p>
                Entre les joueurs romands et l’équipe de Suisse, cela n’a pas toujours été une
                folle histoire d’amour. <b>Les «Welsches» sont cependant montés en puissance
                dans les années nonante</b> – comme par hasard, en même temps que l’équipe de
                Suisse. C’est la génération dorée des Pascolo, Geiger, Hottiger, Ohrel et
                Chapuisat (entre autres). Le record de présence allait être atteint en l’an 2000,
                17 joueurs romands ayant porté le maillot rouge à croix banche cette année-là.
                Depuis, la tendance est à la baisse, à l’exception de deux pics en 2005 (14) et
                2007 (15).
              </p>
            </div>
          </div>  

          <div className='ui container computer or lower hidden'>
            <img className="ui fluid image" src={require("./images/dataviz_romands-desktop.png")} alt="" />
          </div>

          <div className='ui container widescreen hidden large screen hidden'>
            <img className="ui fluid image" src={require("./images/dataviz_romands-mobile.png")} alt="" />
          </div>

          <div className='ui container'>
            <div className='ui text container no-marg'>
              <p>
                Quant aux cantons romands pourvoyeurs de l’équipe nationale, ils sont
                majoritairement trois, sans grande surprise: Vaud (de 2000 à 2010), Genève
                (particulièrement de 2005 à 2014) et le Valais (de 1994 à l’an 2000 surtout)
                sont loin devant Fribourg, Neuchâtel et le Jura, qui ne fournissent
                qu’épisodiquement le cadre national.
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">11</div>
                <h2>Les statistiques</h2>
              </div>
              <p>
                L’équipe de Suisse a disputé à ce jour 33 matches en phase finale de Coupe du
                monde. Son bilan global est négatif: 11 victoires, 6 matches nuls et 16 défaites
                pour une différence de buts de -14 (45 buts marqués, 59 encaissés).
              </p>
              <p>
                La Suisse s’est imposée à trois reprises par trois buts d’écart: <Inlinescore className="score" score={[4,1]} /> contre l’Italie
                en 1954, <Inlinescore className="score" score={[4,1]} /> contre la Roumanie en 1994 et <Inlinescore className="score" score={[3,0]} /> contre le Honduras en 2014.
              </p>
              <p>
                À l’inverse, elle s’est inclinée une fois par cinq buts d’écart (<Inlinescore className="score" score={[0,5]} /> contre
                l’Allemagne en 1966) et quatre fois par trois buts d’écart (<Inlinescore className="score" score={[0,3]} /> contre la
                Yougoslavie en 1950, <Inlinescore className="score" score={[0,3]} /> contre l’Italie en 1962, <Inlinescore className="score" score={[0,3]} /> contre l’Espagne en 1994
                et <Inlinescore className="score" score={[2,5]} /> contre la France en 2014).
              </p>

              <img className="ui fluid image" src={require("./images/dataviz_stats.png")} alt="" />

              <p>
                Le match dans lequel elle a mis le plus de buts est le fameux quart de finale
                contre l’Autriche en 1954: elle a fait trembler les filets à cinq reprises!
                Paradoxalement, elle s’est inclinée <Inlinescore className="score" score={[5,7]} />.
              </p>
              <p>
                La Suisse a dû attendre la Coupe du monde 2006 en Allemagne (et son 23e
                match en phase finale) pour boucler une rencontre sans encaisser de but: <Inlinescore className="score" score={[0,0]} />
                contre la France. Elle a enchaîné avec trois autres blanchissages cette année-là
                (<Inlinescore className="score" score={[2,0]} /> contre le Togo, <Inlinescore className="score" score={[2,0]} /> contre la Corée du Sud, <Inlinescore className="score" score={[0,0]} /> ap contre l’Ukraine en 8 e de
                finale) pour devenir la seule équipe au monde à avoir été éliminée sans avoir
                encaissé le moindre but dans le jeu (défaite <Inlinescore className="score" score={[0,3]} /> aux tirs au but contre l’Ukraine
                en huitième).
              </p>
              <p>
                Le <b>meilleur buteur</b> de la Suisse en phase finale est Sepp Hügi (6 buts), qui
                devance André Abegglen et Robert Ballaman (chacun 4). Suivent Jacky Fatton,
                Leopold Kielholz et Xherdan Shaqiri (3), Alexander Frei et Adrian Knup (2), et
                enfin 18 autres joueurs ayant chacun marqué un but.
              </p>
              <p>
                Sepp Hügi (lors de la défaite <Inlinescore className="score" score={[5,7]} /> contre l’Autriche en 1954) et Xherdan Shaqiri
                (à l’occasion du succès <Inlinescore className="score" score={[3,0]} /> contre le Honduras en 2014) sont les seuls joueurs
                suisses à avoir réussi le <b>coup du chapeau</b> en phase finale.
              </p>
            </div>
          </div>

          <div className='ui container stat-bloc'>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small">12</div>
                <h2>L'argent</h2>
              </div>
              <p>
                La FIFA a considérablement augmenté sa dotation par rapport au Mondial
                brésilien d’il y a quatre ans. En Russie, les 32 pays qualifiés se partageront la
                somme de <b>400 millions de dollars</b>, ce qui représente une augmentation de 12%
                par rapport aux 358 millions de dollars de l’édition 2014.
              </p>
            {/*<p>
                Chaque pays qualifié recevra une prime de 8 millions de dollars. Les huitièmes
                de finalistes toucheront 9 millions de dollars, les quarts de finalistes 14 millions,
                le quatrième 20 millions, le troisième 22 millions, le finaliste 25 millions et le
                champion du monde 35 millions.
                En plus de ces sommes qui seront donc allouées aux Fédérations en fonction de
                leur parcours en Russie, la FIFA a d’ores et déjà dédommagé les équipes
                qualifiées pour leur frais de préparation, à hauteur de 1,5 million de dollars par
                nation.
              </p>*/}

              <img className="ui fluid image" src={require("./images/dataviz_argent.png")} alt="" />

              <p>
                En plus de ces sommes qui seront donc allouées aux fédérations en fonction de
                leur parcours en Russie, la FIFA a d’ores et déjà dédommagé les équipes
                qualifiées pour leur frais de préparation, à hauteur de 1,5 million de dollars chacune.
              </p>
              <p>
                En Russie, les frais d’hôtel et de transport sont pris en charge dans leur entier
                par la FIFA, jusqu’à concurrence de 50 personnes. Dans le cas de la Suisse, la
                FIFA payera l’aller-retour Zurich - Samara (aéroport le plus proche du camp de
                base de la Nati à Togliatti) et les transferts internes pour rallier les villes dans
                lesquelles jouera la Suisse, plus évidemment toutes les nuitées du séjour.
              </p>
              <p>
                La délégation de l’Association suisse de football (ASF) sera composée de <b>55
                personnes</b>, soit 23 joueurs et 32 accompagnants (staff technique et médical,
                dirigeants, officiels, cuisiniers, cellule médias, analyste vidéo). L’ASF devra donc
                prendre à son compte les frais de ces cinq personnes supplémentaires (et
                d’éventuels autres invités ponctuels).
              </p>
            </div>
          </div>

          <div className='ui container pronocards-container' style={{textAlign: "center"}}>

            <div className='ui text container no-marg' style={{textAlign: "left"}}>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <div className="section-number small inverted">13</div>
                <h2>Le pronostic</h2>
              </div>
              <p>
                Aux yeux des spécialistes de l’Agence Sport-Center, la rédaction sportive
                unifiée des publications romandes de Tamedia, <b>l’Allemagne est la grande
                favorite du Mondial qui s’annonce</b>.
              </p>
              <p>
                Sur six journalistes sondés, quatre d’entre eux la donnent championne du
                monde, un cinquième la voyant perdre en finale. Quant aux deux reporters
                n’ayant pas plébiscité l’Allemagne, ils ont misé sur le Brésil.
              </p>
              <p>
                La France, la Croatie, l’Espagne, l’Angleterre et l’Argentine sont également des
                pays cités. Mais comme finalistes, pas comme vainqueurs.
              </p>
            </div>

            <div style={{marginTop: "60px"}}><span className="special">Retournez les cartes pour découvrir le pronostic</span></div>
            <Pronocard title="Jeux vidéos" candidates={["Belgique", "France", "Brésil", "Espagne", "Allemagne"]} switzerland="0 fois" source="Football manager 2018: sur 100 coupes du monde simulées"/>
            <Pronocard title="Mathématiques" candidates={["Brésil", "Allemagne", "Argentine", "Espagne", "Belgique"]} switzerland="1,4%" source="Statistiques Opta"/>
            <Pronocard title="Bookmakers" candidates={["Allemagne", "France", "Espagne", "Brésil", "Argentine"]} switzerland="26" source="Moyenne de cotes sur 8 sites de paris sportifs en ligne"/>
            <Pronocard title="Nos journalistes" candidates={["Allemagne", "Brésil"]} switzerland="16" source="Les pronostics du Sportcenter"/>
            <Pronocard title="La chèvre" candidates={["Belgique", "France"]} switzerland="" source="La chèvre Zabiyaka du zoo de Samara"/>
          </div>

          <div className='ui container'>
            <div className='ui text container no-marg'>
              <p><b>Sources</b></p>
              <p>
                transfermarkt.com, fifa.com, Association suisse de football
              </p>
            </div>
          </div>

          {/*<div className='ui container' style={{textAlign: "center"}}>
            <div className='ui text container no-marg'>
              <div className="title-bloc" style={{textAlign: "center"}}>
                <img className="ui fluid image" src={require("./images/quiz_impossible-02.png")}  style={{width: "200px", display:"inline-block"}} alt="" />
              </div>
              <p><b>La réponse au quiz de l'impossible</b><br/>Nom du Joueur</p>
              <p>
                J’ai joué avec Frei et Yakin, mais pas Suárez.<br/>
                J’ai évolué dans le même club que Chapuisat, mais jamais avec lui.<br/>
                Dans ma carrière je n'ai jamais marché seul, et j'ai porté les couleurs de Barcelone, sans avoir joué en Espagne.<br/>
                <b>Qui suis-je?</b>
              </p>
            </div>
          </div>*/}

        </main>

        <footer className='ui vertical segment'>
          <div className='ui container'>
            <div className='ui two column divided stackable grid'>
              <div className='stretched aligned row'>
                <div className='column'>
                  <table className='ui definition very basic small infographic table'>
                    <tbody>
                      <tr>
                        <td>Textes</td>
                        <td>Renaud Tschoumy, Daniel Visentini</td>
                      </tr>
                      <tr>
                        <td>Vidéos</td>
                        <td>Pascal Wassmer, Frédéric Thomasset</td>
                      </tr>
                      <tr>
                        <td>Concept visuel et illustrations</td>
                        <td>
                          Mathieu Rudaz
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
                    mailTo='24heures.web@sr.tamedia.ch' />
                  <div className='ui fluid share container'>
                    <PolymorphicShareButtons
                      articleId='29787437'
                      hashtags={['Coupe du monde', 'Mondial']}
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
