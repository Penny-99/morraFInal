'reach 0.1';

const [ isFinger, ZERO, ONE, TWO, THREE, FOUR, FIVE ] = makeEnum(6);
const [ isGuess, G_ZERO, G_ONE, G_TWO, G_THREE, G_FOUR, G_FIVE, G_SIX, 
        G_SEVEN, G_EIGHT, G_NINE, G_TEN] = makeEnum(11);
const [ isOutcome, BOB_WINS, DRAW, ALICE_WINS ] = makeEnum(3);

const winner = (AliceFinger, BobFinger, AliceGuess, BobGuess) => { 
  if (AliceGuess != BobGuess){
    if (AliceGuess == (AliceFinger+ BobFinger)){
      const outcome = ALICE_WINS;
      return outcome;
    }else{
      if(BobGuess == (AliceFinger+ BobFinger)){
        const outcome = BOB_WINS;
        return outcome;
      }else{
        const outcome = DRAW;
        return outcome;
      }
    }
  }else{
    const outcome = DRAW;
    return outcome;
  }};

assert(winner(TWO,ZERO,G_TWO,G_ZERO)== ALICE_WINS);
assert(winner(ZERO,TWO,G_ZERO,G_TWO)== BOB_WINS);
assert(winner(ZERO,ONE,G_ZERO,G_TWO)== DRAW);
assert(winner(ONE,ONE,G_ONE,G_ONE)== DRAW);

forall(UInt, AliceFinger =>
  forall(UInt, BobFinger =>
    forall(UInt, AliceGuess =>
      forall(UInt, BobGuess =>
    assert(isOutcome(winner(AliceFinger, BobFinger, AliceGuess, BobGuess)))))));

forall(UInt, (fingerAlice) =>
  forall(UInt, (fingerBob) =>       
    forall(UInt, (guess) =>
      assert(winner(fingerAlice, fingerBob, guess, guess) == DRAW))));

const Player ={ 
  ...hasRandom,
  getFinger: Fun([], UInt),
  informTimeout: Fun([], Null),
  getGuess: Fun([UInt], UInt),
  seeOutcome: Fun([UInt], Null),
  seeTotalNumber: Fun([UInt], Null),
}; 

export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    ...Player,
    wager: UInt,
    deadline: UInt,
  });
  const Bob   = Participant('Bob', {
    ...Player,
    acceptWager: Fun([UInt], Null),
  });
  init();

  const informTimeout = () => {
    each([Alice, Bob], () => {
      interact.informTimeout();
    });
  };

  Alice.only(() => {
    const wager = declassify(interact.wager);
    const deadline = declassify(interact.deadline);
  });
  Alice.publish(wager, deadline)
    .pay(wager);
  commit();
  Bob.only(() => {
    interact.acceptWager(wager);
  });
  Bob.pay(wager)
    .timeout(relativeTime(deadline), () => closeTo(Alice, informTimeout));
 
  var outcome = DRAW;      
  invariant(balance() == 2 * wager && isOutcome(outcome));
  while ( outcome == DRAW ) {
    commit();
    Alice.only(() => {    
      const _fingerAlice = interact.getFinger();
      const [_commitAlice, _saltAlice] = makeCommitment(interact, _fingerAlice);
      const commitAlice = declassify(_commitAlice);
      
      const _guessAlice = interact.getGuess(_fingerAlice);     
      const [_guessCommitAlice, _guessSaltAlice] = makeCommitment(interact, _guessAlice);
      const guessCommitAlice = declassify(_guessCommitAlice);
    });
  
    Alice.publish(commitAlice)
      .timeout(relativeTime(deadline), () => closeTo(Bob, informTimeout));
    commit();    

    Alice.publish(guessCommitAlice)
      .timeout(relativeTime(deadline), () => closeTo(Bob, informTimeout));
    commit();

    unknowable(Bob, Alice(_fingerAlice, _saltAlice));
    unknowable(Bob, Alice(_guessAlice, _guessSaltAlice));

    Bob.only(() => {
      const _BobFinger = interact.getFinger();
      const _BobGuess = interact.getGuess(_BobFinger);
      const BobFinger = declassify(_BobFinger);
      const BobGuess = declassify(_BobGuess);
    });

    Bob.publish(BobFinger)
      .timeout(relativeTime(deadline), () => closeTo(Alice, informTimeout));
    commit();
    Bob.publish(BobGuess)
      .timeout(relativeTime(deadline), () => closeTo(Alice, informTimeout));
    commit();

    Alice.only(() => {
      const [saltAlice, AliceFinger] = declassify([_saltAlice, _fingerAlice]); 
      const [guessSaltAlice, AliceGuess] = declassify([_guessSaltAlice, _guessAlice]); 
    });
    Alice.publish(saltAlice, AliceFinger)
      .timeout(relativeTime(deadline), () => closeTo(Bob, informTimeout));
    checkCommitment(commitAlice, saltAlice, AliceFinger);
    commit();

    Alice.publish(guessSaltAlice, AliceGuess)
    .timeout(relativeTime(deadline), () => closeTo(Bob, informTimeout));
    checkCommitment(guessCommitAlice, guessSaltAlice, AliceGuess);
    commit();
    
    Alice.only(() => {        
      const totalNumber = AliceFinger + BobFinger;
      interact.seeTotalNumber(totalNumber);
    });
  
    Alice.publish(totalNumber)
    .timeout(relativeTime(deadline), () => closeTo(Alice, informTimeout));
    commit();

    Bob.only(() => {
      const totalNumber2 = AliceFinger + BobFinger;
      interact.seeTotalNumber(totalNumber2);
    });
  
    Bob.publish(totalNumber2)
    .timeout(relativeTime(deadline), () => closeTo(Bob, informTimeout));

    outcome = winner(AliceFinger, BobFinger, AliceGuess, BobGuess);
    continue; 
  }

  assert(outcome == ALICE_WINS || outcome == BOB_WINS);
  transfer(2 * wager).to(outcome == ALICE_WINS ? Alice : Bob);
  commit();

  each([Alice, Bob], () => {
    interact.seeOutcome(outcome); 
  })
  exit(); 
});
