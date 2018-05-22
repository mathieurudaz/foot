import React, { Component } from 'react';
import './Player.css';
import { defaultClickHandler } from '@ta-interaktiv/react-share-buttons'
import { PureShareButtons } from '@ta-interaktiv/react-share-buttons'

// No matched player message component
function NoMatchedPlayerMsg(props){
  if(!props.exactMatch){
    return <div className='container small-message'>
      <div className='ui container'>
        <div className='ui text container no-marg center aligned'>
          Aucun joueur ne correspond à <b>toutes</b> vos réponses. Nous avons sélectionné <b>un des joueurs qui vous ressemblent le plus</b>.
        </div>
      </div>
    </div>
  }else{
    return null;
  }
}

function getImage(id){
  return require('./images/portrait-'+ id +'.jpg')
  //return require('./images/portrait-test.jpg')
}

function getPosition(positionId){
  let positions = ["Gardien", "Défenseur", "Milieu", "Attaquant"]
  return positions[positionId]
}

class Card extends Component {
  render() {
    if (!this.props.player) {
      return null;
    }

    return (
      <div>
        <NoMatchedPlayerMsg exactMatch={this.props.exactMatch}/>
        <div className='result'>
            <div className="resume">
              <div className="resume-content" style={{backgroundImage: "url("+getImage(this.props.player.id)+")"}}>
                <div className='ui center aligned container'>
                  <div className='ui'>
                    <div>Votre joueur</div>
                    <div className="name">
                      <div className="firstname">
                        {this.props.player.firstname}
                      </div>
                      <div className="lastname">
                        {this.props.player.lastname}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="country">
                      {this.props.player.team}
                    </div>
                  </div>
                </div>
                <PureShareButtons
                  inverted={true}
                  url={window.location.href}
                  clickHandler={defaultClickHandler}
                  displayType='horizontal icons'
                />
              </div>
              {/*this.props.answers.map((answer, index) => {
                return <p key={index}>{"Question " + index + ": " + answer}</p>
              })*/}
            </div>
            <div className="portrait">

                <div className='stats-header'>
                  <div className="stats-bloc">
                    <div className="row stats-label">
                      Année(s) de participation
                    </div>
                    <div className="row stats-value">
                      {this.props.player.years}
                    </div>
                  </div>
                </div>

              <div className='portrait-content'>
                <div className="stats ui two column doubling stackable grid">
                  <div className="column">
                    <div className="stats-bloc">
                      <div className="row stats-label">
                        Taille
                      </div>
                      <div className="row stats-value">
                        {this.props.player.height} CM
                      </div>
                    </div>
                    <div className="stats-bloc">
                      <div className="row stats-label">
                        Poids
                      </div>
                      <div className="row stats-value">
                        {this.props.player.weight} KG
                      </div>
                    </div>
                    <div className="stats-bloc">
                      <div className="row stats-label">
                        Poste
                      </div>
                      <div className="row stats-value">
                        {getPosition(this.props.player.position)}
                      </div>
                    </div>
                    <div className="stats-bloc">
                      <div className="row stats-label">
                        Matchs joués
                      </div>
                      <div className="row stats-value">
                        {this.props.player.matches}
                      </div>
                    </div>
                  <div className="stats-bloc">
                    <div className="row stats-label">
                      Champion du Monde
                    </div>
                    <div className="row stats-value">
                      {this.props.player.worldcup}
                    </div>
                  </div>
                  </div>
                  <div className="column">
                    <div className="stats-bloc">
                      <div className="row stats-label">
                        Buts marqués
                      </div>
                      <div className="row stats-value">
                        {this.props.player.goals}
                      </div>
                    </div>
                    <div className="stats-bloc">
                      <div className="row stats-label">
                        Matchs gagnés
                      </div>
                      <div className="row stats-value">
                        {this.props.player.win}
                      </div>
                    </div>
                    <div className="stats-bloc">
                      <div className="row stats-label">
                        Cartons jaunes
                      </div>
                      <div className="row stats-value">
                        {this.props.player.yellow}
                      </div>
                    </div>
                    <div className="stats-bloc">
                      <div className="row stats-label">
                        Cartons rouges
                      </div>
                      <div className="row stats-value">
                        {this.props.player.red}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

export default Card;
