/**
 * * Commentary:
 * In the task, I enhanced a physics-based game using JavaScript and the p5.js library. The goal was to create an interactive environment with various elements, including a moving propeller, flying birds, a tower of boxes, and a slingshot mechanism.

In the first part, I amended the setupPropeller() function to create a static body representing the propeller at a specific location and size, and then I added it to the physics world. I also modified the drawPropeller() function to control the propeller's angle and angular velocity, allowing it to rotate smoothly.

For the second enhancement, I implemented the setupBird() function to create birds wherever the mouse was clicked. Then, I updated the drawBirds() function to draw the birds on the screen and remove them from the world when they left the screen boundaries.

Next, I improved the setupTower() function to create a tower of boxes, and then I adjusted the drawTower() function to draw the tower with random shades of green.

In the subsequent step, I introduced the setupSlingshot() function to initialize a slingshot bird and constraint in the physics world. Then, I updated the drawSlingshot() function to display the slingshot bird and constraint, enabling the user to control the slingshot by dragging and releasing the mouse.

For the further development part, I added two features. First, I introduced a countdown timer to give the player 60 seconds to remove all the boxes from the screen. If successful, they won; otherwise, the game displayed a GAME OVER message. Second, I altered the game's colors and style to create a unique visual experience.

The resulting game provided an engaging and interactive environment where players could control the propeller, launch birds with a slingshot, remove boxes, and experience the challenge of a timed game. The added countdown and visual changes enhanced the overall gaming experience, making it more enjoyable and entertaining for players.
 * 
 */



// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine; 
var propeller;
var boxes = [];
var birds = [];
var colors = [];
var ground;
var slingshotBird, slingshotConstraint;
var angle=0;
var angleSpeed=0;
var canvas;

var startTime;
var timeLimit = 60;
var gameOver = false;

////////////////////////////////////////////////////////////
function setup() { // setup the physics engine
  canvas = createCanvas(1000, 600);

  engine = Engine.create();  // create an engine

  setupGround(); // setup ground object 

  setupPropeller(); // setup propeller object 

  setupTower(); // setup tower object 

  setupSlingshot(); // setup slingshot object 

  setupMouseInteraction(); // setup mouse interaction 

  startTime = millis(); // Start the clock 

}
////////////////////////////////////////////////////////////
function draw() { // update and display the physics world
  background(0);

  Engine.update(engine); // update physics world 

  drawGround(); // draw ground object 

  drawPropeller(); // draw propeller object 

  drawTower(); // draw tower object 

  drawBirds(); // draw birds object

  drawSlingshot(); // draw slingshot object
 
  var currentTime = millis();
  var elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
  var remainingTime = timeLimit - elapsedTime;
  
  if (remainingTime <= 0) { // Check if time is up 
    gameOver = true;
  }
  
  if (gameOver) { 
    // Display GAME OVER message
    textSize(32);
    textAlign(CENTER);
    fill(255, 0, 0);
    text("GAME OVER", width / 2, height / 2);
    return; // Exit the draw function
  }
  
  // Display the remaining time
  textSize(20);
  textAlign(LEFT);
  fill(255);
  text("Time Remaining: " + floor(remainingTime) + " seconds", 10, 30);

  // Check if all boxes are removed
  var allBoxesRemoved = true; // Flag to track if all boxes are removed

  for (var i = 0; i < boxes.length; i++) { // Loop through all boxes 
    var box = boxes[i];
    if (!isOffScreen(box)) {
      allBoxesRemoved = false;
      break;
    }
  }

  if (!gameOver && allBoxesRemoved) { // Check if all boxes are removed 
    // Display YOU WIN message
    textSize(32);
    textAlign(CENTER);
    fill(0, 255, 0);
    text("YOU WIN!", width / 2, height / 2);
    // gameOver = true; // Set gameOver flag to true
    return; // Exit the draw function
  }

}
////////////////////////////////////////////////////////////
//use arrow keys to control propeller
function keyPressed(){
  if (keyCode == LEFT_ARROW){
    //your code here
    angleSpeed += 0.01;
  }
  else if (keyCode == RIGHT_ARROW){
    //your code here
    angleSpeed -= 0.01;
  }
}
////////////////////////////////////////////////////////////
function keyTyped(){ //use keys to add boxes and birds to the world 
  //if 'b' create a new bird to use with propeller
  if (key==='b'){
    setupBird();
  }

  //if 'r' reset the slingshot
  if (key==='r'){
    removeFromWorld(slingshotBird);
    removeFromWorld(slingshotConstraint);
    setupSlingshot();
  }
}

//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

//if mouse is released destroy slingshot constraint so that
//slingshot bird can fly off
function mouseReleased(){
  setTimeout(() => {
    slingshotConstraint.bodyB = null;
    slingshotConstraint.pointA = { x: 0, y: 0 };
  }, 100);
}
////////////////////////////////////////////////////////////
//tells you if a body is off-screen
function isOffScreen(body){
  var pos = body.position;
  return (pos.y > height || pos.x<0 || pos.x>width);
}
////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
  World.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices) { // draw vertices of a body 
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) { // draw constraint  
  push();
  var offsetA = constraint.pointA;
  var posA = {x:0, y:0};
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  var offsetB = constraint.pointB;
  var posB = {x:0, y:0};
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
} 
