let btn = document.getElementById('clear');
let skip = document.getElementById('skip');
let task = document.getElementById('task');
let label = document.getElementById('label');
let conf = document.getElementById('conf');

let scoreLabel = document.getElementById('score_label');
let timerLabel = document.getElementById('timer_label');

let currentTask;
let score = 10;
let timer = 90;
let interval;

let classifier;
let canvas;

let hasPlayerLost = false;

let doodles = ["apple", "alarm_clock", "cat", "dog", "airplane", "banana", "angel", "barn", "basketball",
  "carrot", "castle", "cello", "fish", "foot", "duck", "ice_cream", "laptop", "microphone", "pear", "piano",
  "blueberry", "blackberry", "boomerang", "stitches", "bandage", "bread", "brain", "clock", "cloud", "circle"
];

function setupX() {
$('.ui.modal')
  .modal({
    closable  : false,
    onDeny    : function(){
      //window.alert('Wait not yet!');
    },
    onApprove : function() {
      //window.alert('Approved!');
    }
  })
  .modal('show')
;
}

// Update score every second
function setupInterval() {
    interval = setInterval(function() {
    timer -= 1;
    timerLabel.innerHTML = timer;
    if (timer <= 0) {
      timerLabel.innerHTML = "0";
      //Clear interval
      clearInterval(interval);
      speak(`You have lost! The answer was ${currentTask} And your final score is ${score}`);
      hasPlayerLost = true;
      skip.innerText = "Reset Game"
    }
  }, 1000)
}

function modelLoaded() {
  console.log("Model Loaded!")
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
  } else {
    console.log(results);
    document.getElementById("label").innerHTML = results[0].label;
    document.getElementById("conf").innerHTML = results[0].confidence.toFixed(3);

    if (results[0].label == currentTask || results[1].label == currentTask || results[2].label == currentTask || results[3].label == currentTask || results[4].label == currentTask || results[5].label == currentTask) {
      speak(`I know! You have drawn ${currentTask}`);
      document.getElementById("label").innerHTML = currentTask;
      score += 10;
      timer += 30
      scoreLabel.innerHTML = score;
      setTask();
    } else {
      speak(`I think you have drawn ${results[0].label}`);
    }
  }
}

function preload() {
  classifier = ml5.imageClassifier('DoodleNet');
}
function classifyCanvas() {
  if (hasPlayerLost) {
    return;
  }
  classifier.classify(canvas, gotResult);
}

function setup() {
  canvas = createCanvas(500, 500);
  let x = (windowWidth - 500) / 2;
  canvas.position(x, 400);
  background(255,255,255);
  //canvas.center();

  setTask();
  setupInterval();

  scoreLabel.innerHTML = score;
}

function generateDoodle() {
  let doodle = doodles[Math.floor(Math.random() * doodles.length)];
  return doodle;
}
function setTask() {
  currentTask = generateDoodle();
  task.innerHTML = currentTask;
}

function mouseReleased() {
  if (isMouseWithinCanvas()) {
    classifyCanvas()
  }
}
function isMouseWithinCanvas() {
  return mouseX > 0 && mouseX < canvas.width && mouseY > 0 && mouseY < canvas.height;
}

function draw() {
  if (keyIsDown(32)) { // 32 is the keycode for spacebar
    stroke(255, 255, 255);
    strokeWeight(100);
  } else {
    stroke(0);
    strokeWeight(20);
  }
}

function clearCanvas(event) {
  if (btn.innerText == "Clear Canvas") {
    btn.innerText = "Are you Sure?"
    event.stopPropagation(); // prevent event from propagating
  } else if (btn.innerText == "Are you Sure?") {
    background(255,255,255);
    btn.innerText = "Clear Canvas"
    event.stopPropagation(); // prevent event from propagating
  }
}

function skipTask(event) {
  if (skip.innerText == "Skip?") {
    skip.innerText = "Skip? (Costs 5 Score)"
    event.stopPropagation(); // prevent event from propagating
  } else if (skip.innerText == "Skip? (Costs 5 Score)") {
    if (score >= 5) {
      score -= 5;
      scoreLabel.innerHTML = score;
      setTask();
    }
    skip.innerText = "Skip?"
    event.stopPropagation(); // prevent event from propagating
  } else {
    setTask();
    setupInterval();
    timer = 60;
    timerLabel.innerHTML = timer;
    score = 0;
    scoreLabel.innerHTML = score;
    hasPlayerLost = false;

    skip.innerText = "Skip?"
    event.stopPropagation(); // prevent event from propagating
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function mouseDragged() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
  btn.innerText = "Clear Canvas"
}

function speak(text) {
  var synth = window.speechSynthesis;
  var utterThis = new SpeechSynthesisUtterance(text);
  synth.speak(utterThis);
}