////////////////////////////////////////////////////////////////
function setupGround(){ //creates the ground object 
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true, angle: 0
  });
  World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround(){ //draws the ground object 
  push();
  fill(128);
  drawVertices(ground.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller(){  //creates the propeller object 
  // your code here
  propeller = Bodies.rectangle(150, 480, 200, 15, {
    isStatic: true,
    angle: angle
  });
  World.add(engine.world, [propeller]);

}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller(){
  push();
  // your code here
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, angleSpeed);
  angle += angleSpeed;
  fill(255,0,0);
  drawVertices(propeller.vertices);
  pop();
}
////////////////////////////////////////////////////////////////
function setupBird(){ //creates a bird object 
  var bird = Bodies.circle(mouseX, mouseY, 20, {friction: 0,
      restitution: 0.95 });
  Matter.Body.setMass(bird, bird.mass*10);
  World.add(engine.world, [bird]);
  birds.push(bird);
}
////////////////////////////////////////////////////////////////
function drawBirds(){ //draws the bird object 
  push();
  //your code here
  fill(0,0,255);
  for (var i = birds.length - 1; i >= 0; i--) {
    var bird = birds[i];
    drawVertices(bird.vertices);
    
    if (isOffScreen(bird)) {
      removeFromWorld(bird);
      birds.splice(i, 1);
    }
  }
  pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower(){
  //you code here
  var boxSize = 80;
  var towerHeight = 6;
  var towerWidth = 3;
  
  for (var j = 0; j < towerHeight; j++) { //rows of boxes 
    for (var i = 0; i < towerWidth; i++) {
      var x = (i * (boxSize + 1)) + (width / 1.2) - ((towerWidth * (boxSize + 1)) / 2);
      var y = height - (j * (boxSize + 10)) - 40;
      var box = Bodies.rectangle(x, y, boxSize, boxSize);
      boxes.push(box);
      var greenShade = color(random(50, 100), random(150, 200), random(50, 100));
      colors.push(greenShade);
    }
  }
  
  World.add(engine.world, boxes); //add boxes to the world 

}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower(){
  push();
  //your code here
  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    var boxColor = colors[i];
    fill(boxColor);
    drawVertices(box.vertices);
  }
  pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot(){
//your code here
slingshotBird = Bodies.circle(300, 200, 20, {
  friction: 0,
  restitution: 0.95
});
Matter.Body.setMass(slingshotBird, slingshotBird.mass * 10);

var constraintOptions = {
  pointA: { x: 300, y: 200 },
  bodyB: slingshotBird,
  stiffness: 0.01,
  damping: 0.0001
};

slingshotConstraint = Constraint.create(constraintOptions); //creates constraint 

World.add(engine.world, [slingshotBird, slingshotConstraint]); //adds constraint to world 
}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot(){
  push();
  // your code here
  // Draw slingshot bird
  fill(255);
  drawVertices(slingshotBird.vertices);

  // Draw slingshot constraint
  drawConstraint(slingshotConstraint);
  
  pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction(){ //sets up mouse interaction 
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);
}
