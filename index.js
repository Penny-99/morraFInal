import React from 'react';
import AppView from './views/AppView.js';
import DeployerView from './views/DeployerView.js';
import AttacherView from './views/AttacherView.js';
import { renderDOM, renderView } from './views/render.js';
import './index.css';
import * as backend from './build/index.main.mjs';
import { loadStdlib } from '@reach-sh/stdlib';
import { ALGO_MyAlgoConnect as MyAlgoConnect } from '@reach-sh/stdlib';


const reach = loadStdlib(process.env);
reach.setWalletFallback(reach.walletFallback({
    providerEnv: 'TestNet', MyAlgoConnect }));

const intToOutcome = ['Bob wins!', 'Draw!', 'Alice wins!'];
const {standardUnit} = reach;
const defaults ={defaultFundAmt: '10', defaultWager:'3', standardUnit};

class App extends React.Component {
  constructor(props){
      super(props);
      this.state ={view:'ConnectAccount', ...defaults};
  }

  async componentDidMount(){
      const acc = await reach.getDefaultAccount();
      const balAtomic = await reach.balanceOf(acc);
      const balance = reach.formatCurrency(balAtomic, 4);
      this.setState({acc, balance});
      if(await reach.canFundFromFaucet()){
          this.setState({view: 'FundAccount'});
      }else{
          this.setState({view: 'DeployerOrAttacher'});
      }
  }

  async fundAccount(fundAmount){
      await reach.fundFromFaucet(this.state.acc, reach.parseCurrency(fundAmount));
      this.setState({view:'DeployerOrAtttacher'});
  }
  async skip(){
      this.setState({view:'DeployerOrAttacher'});
  }
  selectAttacher(){
      this.setState({view:'Wrapper', ContentView:Attacher});
  }
  selectDeployer(){
      this.setState({view:'Wrapper', ContentView: Deployer});
  }
  render(){ return renderView(this, AppView);}

}

class Player extends React.Component{
  random(){ return reach.hasRandom.random();}
  async getFinger(){
      const finger = await new Promise(resolveFinger => {
          this.setState({view:'getFinger', playable:true, resolveFinger});
      });
  this.setState({view:'WaitingForResults', finger});
  return finger;
  }
  async getGuess(i){
    const guess = await new Promise(resolveGuess => {
        this.setState({view:'getGuess', playable:true, resolveGuess, finger: i});
    });
    this.setState({view:'WaitingForResults', guess});
    return guess;
    }
  seeTotalNumber(i){this.setState({view:'Total', total: i});}
  seeOutcome(i){this.setState({view:'Outcome', outcome: intToOutcome[i]});}
  informTimeout(){this.setState({view:'Timeout'});}
  playFinger(finger){ this.state.resolveFinger(finger);}
  playGuess(guess) { 
    guess = this.state.resolveGuess(guess);}
}

class Deployer extends Player{
  constructor(props){
      super(props);
      this.state ={view:'SetWager'};
  }
  setWager(wager){ this.setState({view:'Deploy', wager});}
  async deploy(){
      const ctc = this.props.acc.contract(backend);
      this.setState({view:'Deploying', ctc});
      this.wager = reach.parseCurrency(this.state.wager);
      this.deadline = { ETH: 10, ALGO: 100, CFX: 1000}[reach.connector];
      backend.Alice(ctc, this);
      const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
      this.setState({view:'WaitingAttacher', ctcInfoStr});
  }
  render(){ return renderView(this, DeployerView);}
}

class Attacher extends Player {
  constructor(props){
      super(props);
      this.state ={ view: 'Attach'};
  }
  attach(ctcInfoStr){
      const ctc = this.props.acc.contract(backend, JSON.parse(ctcInfoStr));
      this.setState({view:'Attaching'});
      backend.Bob(ctc, this);
  }
  async acceptWager(wagerAtomic){ 
      const wager = reach.formatCurrency(wagerAtomic, 4);
      return await new Promise(resolveAccepted => {
          this.setState({view:'Accept', wager, resolveAccepted});
      });
  }
  termsAccepted(){
      this.state.resolveAccepted();
      this.setState({view:'WaitingTurn'});
  }
  render(){ return renderView(this, AttacherView);}
}

renderDOM(<App />)
