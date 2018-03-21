import React, { Component } from 'react';
import './Player.css';

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='result container-fluid'>
        <div className="resume">
          <div className="row">
            <div className="col-md-offset-1 col-md-11">
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
            <div className="col-md-offset-1 col-md-11">
              <div className="country">
                {this.props.player.country}
              </div>
            </div>
          </div>
          <div className="row bio">
            <div className="col-md-offset-1 col-md-6">
              {this.props.player.bio}
            </div>
          </div>
          {/*this.props.answers.map((answer, index) => {
            return <p key={index}>{"Question " + index + ": " + answer}</p>
          })*/}
        </div>
        <div className='portrait' />
      </div>
    );
  }
}

export default Card;
