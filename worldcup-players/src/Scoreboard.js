import React, { Component } from 'react';
import './Scoreboard.css';

class Flipboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      newNum: 0,//(new Date).getSeconds() === 0 ? 9 : (new Date).getSeconds(),
      oldNum: 0,//(new Date).getSeconds() - 1 === -1 ? 8 : (new Date).getSeconds() - 1,
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
        setTimeout(() => {this.reset(); this.timerID = setInterval(() => this.tick(), 500 );}, 2000)
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
    );
  }
}

class Scoreboard extends Component {
  render() {
    return(
      <div className="scoreboard">
        <Flipboard score={this.props.score[0]} />
        <div className="scorevs">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
        </div>
        <Flipboard score={this.props.score[1]} />
      </div>
    )
  }
}

export default Scoreboard;

