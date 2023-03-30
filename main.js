let btn = document.getElementById('clear');

function setupX() {
$('.ui.modal')
  .modal({
    closable  : false,
    onDeny    : function(){
      window.alert('Wait not yet!');
    },
    onApprove : function() {
      window.alert('Approved!');
    }
  })
  .modal('show')
;
}

function preload() {
  
}

function setup() {
  canvas = createCanvas(500, 500);
  canvas.center();
  background(255,255,255);
  video = createCapture(VIDEO);
  video.size(500, 500);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function draw() {
  if (keyIsDown(32)) { // 32 is the keycode for spacebar
    stroke(255, 255, 255);
    strokeWeight(50);
  } else {
    stroke(0);
    strokeWeight(5);
  }
}

function clearCanvas(event) {
  background(255,255,255);
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
  btn.innerText = "Clear Canvas"
}

function mouseDragged() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
  btn.innerText = "Clear Canvas"
}

function modelLoaded() {
  console.log('PoseNet Is Initialized');
}

function gotPoses(results) {
  if(results.length > 0) {
    // DO sth
  }
}