import React from 'react';

const exports = {};

exports.getFinger = class extends React.Component {
  render() {
    const {parent, playable, finger} = this.props;
    return (
      <div>
        <br />
        {!playable ? 'Please wait...' : ''}
        <br />
        <h1>Please choose the number of finger to play:</h1>
        <button
          disabled={!playable}
          onClick={() => parent.playFinger(0)}>0</button>
        <button
          disabled={!playable}
          onClick={() => parent.playFinger(1)}>1</button>
        <button
          disabled={!playable}
          onClick={() => parent.playFinger(2)}>2</button>
        <button
          disabled={!playable}
          onClick={() => parent.playFinger(3)}>3</button>
        <button
          disabled={!playable}
          onClick={() => parent.playFinger(4)}>4</button>
        <button
          disabled={!playable}
          onClick={() => parent.playFinger(5)}>5</button>  
      </div>
    );
  }
};

exports.getGuess = class extends React.Component {
  render() {
    const {parent, playable, guess, finger} = this.props;
    return (
      <div>
        <br />
        {!playable ? 'Please wait...' : ''}
        <br />
        <br />
          You played {parseInt(finger)} fingers.
        <br />
        <br />
          Guess the total number of finger.
        <br />
        <button
          disabled={!playable|| 0 < parseInt(finger)}
          onClick={() => parent.playGuess(0)}>0</button>
        <button
          disabled={!playable|| 1< parseInt(finger)}
          onClick={() => parent.playGuess(1)}>1</button>
        <button
          disabled={!playable|| 2< parseInt(finger)}
          onClick={() => parent.playGuess(2)}>2</button>
        <button
          disabled={!playable|| 3< parseInt(finger)}
          onClick={() => parent.playGuess(3)}>3</button>
        <button
          disabled={!playable|| 4< parseInt(finger)}
          onClick={() => parent.playGuess(4)}>4</button>
        <button
          disabled={!playable|| 5< parseInt(finger)}
          onClick={() => parent.playGuess(5)}>5</button>
       <button
          disabled={!playable|| 6< parseInt(finger)}
          onClick={() => parent.playGuess(6)}>6</button>
       <button
          disabled={!playable|| 7< parseInt(finger)}
          onClick={() => parent.playGuess(7)}>7</button>
       <button
          disabled={!playable|| 8<parseInt(finger)}
          onClick={() => parent.playGuess(8)}>8</button>
       <button
          disabled={!playable|| 9<parseInt(finger)}
          onClick={() => parent.playGuess(9)}>9</button>
       <button
          disabled={!playable|| 10<parseInt(finger)}
          onClick={() => parent.playGuess(10)}>10</button>
      </div>
    );
  }
}

exports.WaitingForResults = class extends React.Component {
  render() {
    return (
      <div>
        Waiting for results...
      </div>
    );
  }
}

exports.Outcome = class extends React.Component {
  render() {
    const {outcome} = this.props;
    return (
      <div>
        Thank you for playing. The outcome of this game was:
        <br />{outcome || 'Unknown'}
      </div>
    );
  }
}

exports.Total = class extends React.Component {
  render() {
    const {total} = this.props;
    return (
      <div>
        The actual total fingers was:
        <br />{parseInt(total) || 'Unknown'}
      </div>
    );
  }
}

exports.Timeout = class extends React.Component {
  render() {
    return (
      <div>
        There's been a timeout. (Someone took too long.)
      </div>
    );
  }
}

export default exports;
