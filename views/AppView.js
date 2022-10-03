import React from 'react';

const exports = {};

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="App">
        <header className="App-header" id="root">
          <h1>Morra Game</h1>
          {content}
        </header>
      </div>
    );
  }
}

exports.ConnectAccount = class extends React.Component {
  render() {
    return (
      <div>
        Welcome to the Morra Game ! 
        Please wait while we connect to your account.
      </div>
    )
  }
}

exports.FundAccount = class extends React.Component {
  render() {
    const {balance, standardUnit, defaultFundAmt, parent} = this.props;
    const amt = (this.state || {}).amt || defaultFundAmt;
    return (
      <div>
        <h2>Account funding</h2>
        <br />
        Balance: {balance} {standardUnit}
        <hr />
        Would you like to fund your account with extra {standardUnit}?
        <br />
        (This only works on certain devnets)
        <br />
        <input
          type='number'
          placeholder={defaultFundAmt}
          onChange={(e) => this.setState({amt: e.currentTarget.value})}
        />
        <button onClick={() => parent.fundAccount(amt)}>Fund Account</button>
        <button onClick={() => parent.skip()}>Skip</button>
      </div>
    );
  }
}

exports.DeployerOrAttacher = class extends React.Component {
  render() {
    const {parent} = this.props;
    return (
      <div>
        Who are you:
        <br />
        <p>
          <button
            onClick={() => parent.selectDeployer()}>Alice(Deployer)</button>
          <br /> Set the wager, deploy the contract.
        </p>
        <p>
          <button
            onClick={() => parent.selectAttacher()}>
            Bob(Attacher)
          </button>
          <br /> Attach to the deployer's contract.
        </p>
      </div>
    );
  }
}

export default exports;
