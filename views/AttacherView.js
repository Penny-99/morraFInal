import React from 'react';
import PlayerViews from './PlayerView.js';

const exports = {...PlayerViews};

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Attacher">
        <h2>Welcome Bob(Attacher)</h2>
        {content}
      </div>
    );
  }
}

exports.Attach = class extends React.Component {
  render() {
    const {parent} = this.props;
    const {ctcInfo} = this.state || {};
    return (
      <div>
        Please paste the contract info here:
        <br />
        <textarea spellCheck="false"
          className='ContractInfo'
          onChange={(e) => this.setState({ctcInfo: e.currentTarget.value})}
          placeholder='{}'
        />
        <br />
        <button
          disabled={!ctcInfo}
          onClick={() => parent.attach(ctcInfo)}>
            Attach
        </button>
      </div>
    );
  }
}

exports.Attaching = class extends React.Component {
  render() {
    return (
      <div>
        Please wait for a moment, we are attaching to the contract...
      </div>
    );
  }
}

exports.Accept = class extends React.Component {
  render() {
    const {wager, standardUnit, parent} = this.props;
    const {disabled} = this.state || {};
    return (
      <div>
        You need to pay
        <br /> Wager: {wager} {standardUnit}
        <br />
        <button
          disabled={disabled}
          onClick={() => {
            this.setState({disabled: true});
            parent.termsAccepted();
          }}>
          Accept and pay wager
          </button>
      </div>
    );
  }
}

exports.WaitingTurn = class extends React.Component {
  render() {
    return (
      <div>
        Please wait for the other player...
      </div>
    );
  }
}

export default exports;
