let deck = [];
let dealtCardsPlayer = [];
let dealtCardsDealer = [];
let currentCount = 0;
let userCount = 0;
let rounds = 0;
let correctGuesses = 0;
const numDecks = 6;
let showCount = false;
let formerCount = 0
let history = [];

function setup() {
  createCanvas(2000, 1000);
  initializeDeck();
  shuffleDeck();
  textSize(20);
  textAlign(CENTER, CENTER);

  userInput = createInput();
  styleInput(userInput, 500, 480);
}
function styleInput(inputElement, x, y) {
	inputElement.position(x, y);
	inputElement.style("padding", "8px");
	inputElement.style("width", "200px");
}

function draw() {
  background(50);
  displayInstructions();
  displayDealerCards();
  displayPlayerCards();
  drawGraph();
  
  if (showCount) {
    fill(255);
    text('Sidste Count: ' + formerCount, 600, 400);
  }
}

function drawGraph() {
  let graphX = 1250, graphY = 300, graphW = 400, graphH = 200;
  
  fill(200);
  text("Performance Over Time", graphX + 100, graphY - 20);
  stroke(255);
  line(graphX, graphY, graphX, graphY + graphH); // Y-akse
  line(graphX, graphY + graphH, graphX + graphW, graphY + graphH); // X-akse

  noFill();
  stroke(0, 255, 0);
  beginShape(); // Tegner antal rigtige
  for (let i = 0; i < history.length; i++) {
    let x = graphX + (i / Math.max(history.length - 1, 1)) * graphW;
    var y = graphY + graphH - (history[i].correct / Math.max(rounds, 1)) * graphH;
    vertex(x, y);
  }
  endShape();
  
  push()
  fill(255,255,255)
  noStroke()
  text(correctGuesses, graphX + graphW + 20, y);
  pop()

  stroke(0, 0, 255);
  beginShape(); // Tegner procent rigtige
  for (let i = 0; i < history.length; i++) {
    let x = graphX + (i / Math.max(history.length - 1, 1)) * graphW;
    let y = graphY + graphH - (history[i].percent / 100) * graphH;
    vertex(x, y);
  }
  endShape();
  
  push()
  fill(255,255,255)
  noStroke()
  text( round((correctGuesses/rounds) * 100) + '%', graphX + graphW + 60, y);
  pop()

  fill(255);
  text("Grøn = Rigtige, Blå = % Korrekte", graphX + 100, graphY + graphH + 20);
}

function initializeDeck() {
  const suits = ["Hearts","Diamonds","Spades","Clubs"];
  const values = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];
  for(let deckNum = 0; deckNum<numDecks;deckNum++){
    for (let i = 0; i < suits.length; i++) {
      let suit = suits[i];
      for (let j = 0; j < values.length; j++) {
        let value = values[j];
        deck.push({ suit: suit, value: value });
      }
    }
  }
}
  
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function dealCardsDealer(numCards) {
  for (let i = 0; i < numCards; i++) {
    dealtCardsDealer.push(deck.pop());
    updateCount(dealtCardsDealer[dealtCardsDealer.length - 1].value);
  }
}

function dealCardsPlayer(numCards) {
  for (let i = 0; i < numCards; i++) {
    dealtCardsPlayer.push(deck.pop());
    updateCount(dealtCardsPlayer[dealtCardsPlayer.length - 1].value);
  }
}

function displayDealerCards() {
  fill(255);
  text('Dealers kort', 300, 100);
  for (let i = 0; i < dealtCardsDealer.length; i++) {
    text(dealtCardsDealer[i].value + ' of ' + dealtCardsDealer[i].suit, 300, 150 + i * 30);
  }
}

function displayPlayerCards() {
  fill(255);
  text('Spillers kort', 900, 100);
  for(let i = 0; i < dealtCardsPlayer.length; i++ ){
    text(dealtCardsPlayer[i].value + ' of ' + dealtCardsPlayer[i].suit, 900, 150 + i * 30);
  }
}

function updateCount(cardValue) {
  if (['2', '3', '4', '5', '6'].includes(cardValue)) {
    currentCount++;
  } else if (['10', 'J', 'Q', 'K', 'A'].includes(cardValue)) {
    currentCount--;
  }
}

function displayInstructions() {
  fill(255);
  text('Tryk D for at deale kort. Tryk R for at nulstille. Skriv din count i boksen og tryk ENTER for at sammenligne med den rigtige count.\nTryk S for at gemme din graf til din computer :)', 600, 50);
  text('Indtast din egen count her :)', 600, 440);
  text('For at tælle kort, skal man først kende kortværdierne. \nDet er egentlig meget simpelt, hvis et kort har en værdi mellem 2 og 6, så går counten op med 1. \nHvis et kort har værdien mellem 10 og A, så går counten ned med 1. \n Dette gælder så for alle kort i spil, og counten går videre til den næste runde af givne kort',1500,100)
}

function keyPressed() {
  if (key === 'd' || key === 'D') {
    dealCardsDealer(2);
    dealCardsPlayer(2);
    userInput.value('');
  } else if (key === 'r' || key === 'R') {
    resetGame();
  } else if (key === 's' || key === 'S'){
    saveGraph();
  }
}

function resetGame() {
  deck = [];
  dealtCardsDealer = [];
  dealtCardsPlayer = [];
  currentCount = 0;
  userCount = 0;
  rounds = 0;
  correctGuesses = 0;
  history = [];
  showCount = false
  initializeDeck();
  shuffleDeck();
}

function keyTyped() {
  if (key === 'Enter') {
    compareCounts();
  }
}

function displayError(){
  fill(255)
  text('Ikke helt, prøv igen',600,500)
}

function compareCounts() {
  userCount = parseFloat(userInput.value());
  if (userCount === currentCount) {
    formerCount = currentCount
	showCount = true;
	correctGuesses++;
  } else {
    displayError();
  }

  rounds++;
  history.push({ correct: correctGuesses, percent: (correctGuesses / rounds) * 100 });

  dealCardsPlayer(2);
  dealCardsDealer(2);

  userInput.value(''); 
}

function saveGraph() {
  let graphImage = get(1200, 250, 500, 300);
  graphImage.save("Min Blackjack graph d. " + day() + ". i " + month() + ".", "png");
}
