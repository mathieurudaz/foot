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

          <div class="cardface cardface_front">
            <div className="card-title">{this.props.title}</div>
          </div>
          <div class="cardface cardface_back">
            <div style={{marginTop: "20px"}}>{this.props.title}</div>
            <div style={{marginTop: "40px"}}>
              <img src={require("./images/stars_single.png")} style={{width: "60px"}}/>
              <ul>{this.props.candidates.map((candidate, index) => {return <li>{index+1}. {candidate}</li>;})}</ul>
            </div>
          </div>

      </div>
    )
  }
}

export default Pronocard;

