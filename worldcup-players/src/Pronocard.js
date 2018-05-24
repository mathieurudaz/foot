import React, { Component } from 'react';
import './Pronocard.css';

class Pronocard extends Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
  }

  getClasses(){
    let classes = ["pronocard"];
    if(this.state.active){
      classes = "pronocard is-flipped" 
    }
    return classes;
  }

  render() {
    return(
      <div
        className={this.getClasses()}
        onClick={() => this.setState({active: true})}>

          <div className="cardface cardface_front">
            <div className="card-title">{this.props.title}</div>
          </div>
          <div className="cardface cardface_back">
            <div style={{marginTop: "20px", fontSize: "16px"}}>{this.props.title}</div>
            <div style={{marginTop: "20px"}}>
              <img src={require("./images/stars_single.png")} style={{width: "60px"}} alt=""/>
              <ul>{this.props.candidates.map((candidate, index) => {return <li key={index}>{index+1}. {candidate}</li>;})}</ul>
            </div>
            <div style={{marginTop: "20px"}}><small className="prono-source">{this.props.source}</small></div>
          </div>

      </div>
    )
  }
}

export default Pronocard;

