import React, { Component } from 'react';
import './Scoreboard.css';

class Flipboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newNum: 0,
      oldNum: 0,
      change: true
    }
  }
  
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      500
    );
  }
  
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  reset(){
    this.setState({
      newNum: 0,
      oldNum: 0,
      change: true
    });
  }
  
  tick() {
    const newNum = this.state.oldNum + 1;
    if( this.state.newNum !== newNum) {
      const oldNum = newNum;
      const change = !this.state.change;
      this.setState({
        newNum,
        oldNum,
        change
      });

      if( this.state.newNum >= this.props.score ){
        clearInterval(this.timerID);
        setTimeout(() => {this.reset(); this.timerID = setInterval(() => this.tick(), 500 );}, 4000)
      }

    }
  }

  render() {

    const { newNum, oldNum, change} = this.state;
    const animation1 = change ? 'fold' : 'unfold';
    const animation2 = !change ? 'fold' : 'unfold';
    const number1 = change ? oldNum : newNum;
    const number2 = !change ? oldNum : newNum;

    return (
      <div style={{display:"inline-block", margin:"40px 0px 30px 0px"}}>
        <div><span className="special">{this.props.team}</span></div>
        <div className={'flipCounter'}>
          <div className={'upperCard'}>
            <span>{newNum}</span>
          </div>
          <div className={'lowerCard'}>
            <span>{oldNum}</span>
          </div>
          <div className={`flipCard first ${animation1}`}>
            <span>{number1}</span>
          </div>
          <div className={`flipCard second ${animation2}`}>
            <span>{number2}</span>
          </div>
        </div>
      </div>
    );
  }
}

class Scoreboard extends Component {

  /*constructor(props) {
    super(props);
    this.state = {
      newNum: 0,
      oldNum: 0,
      change: true
    }
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      500
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    const newNum = this.state.oldNum + 1;
    if( this.state.newNum !== newNum) {
      const oldNum = newNum;
      const change = !this.state.change;
      this.setState({
        newNum,
        oldNum,
        change
      });

      if( this.state.newNum >= this.props.score ){
        clearInterval(this.timerID);
        setTimeout(() => {this.reset(); this.timerID = setInterval(() => this.tick(), 500 );}, 4000)
      }

    }
  }*/

  render() {
    return(
      <div className="scoreboard">
        <Flipboard team={this.props.teams[0]} score={this.props.score[0]} scoremax={Math.max(...this.props.score)} />
        <div className="scorevs">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
        </div>
        <Flipboard team={this.props.teams[1]} score={this.props.score[1]} scoremax={Math.max(...this.props.score)} />
      </div>
    )
  }
}

export default Scoreboard;

