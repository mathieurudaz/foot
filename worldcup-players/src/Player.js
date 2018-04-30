import React, { Component } from 'react';
import './Player.css';

// No matched player message component
function NoMatchedPlayerMsg(props){
  if(!props.exactMatch){
    return <div className='container small-message'>
      <div className='row'>
        <div className="col-md-offset-2 col-md-8 text-center">
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
        <div className='result container-fluid'>
          <div className='row'>
            <div className="resume col-md-6">
              <div className="resume-content text-center" style={{backgroundImage: "url("+getImage(this.props.player.id)+")"}}>
                <div className="row">
                  <div className="col-md-12">
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
              </div>
              {/*this.props.answers.map((answer, index) => {
                return <p key={index}>{"Question " + index + ": " + answer}</p>
              })*/}
            </div>
            <div className='portrait col-md-6'>
              <div className='portrait-content'>
                <div className="stats">
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
                      Test user
                    </div>
                    <div className="row stats-value">
                      <img style={{width:"100%", height:"auto"}} src={require("./images/graphs.png")} />
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
