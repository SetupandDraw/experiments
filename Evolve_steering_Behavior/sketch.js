/* @SetupDraw first implementation of Daniel Shiffman's Evolve_Steering_Behaviors
A new "dynasty" is added to the system automatically when there are no vehicles left. The new dynasty will be based on prev generation champion’s DNA. Probability of reproduction also related to a requested minimum health value.
Press CTRL to toggle debug on/off.
Mouse press for adding new vehicles.
*/

var vehicles = [];
var vehiclesNum = 10;
var food = [];
var poison = [];
var foodPieces = 40; // 40
var poisonPieces = 20; // 20

var timer;
var nextTimer = 0;
var lonRecord = 0;
var tamagotchiMode = false;

var d = 25; // boundaries limith within the canvas borders
var genCount = 0; // keep track of generations

var debug = true;

function setup() {
  //var canvas = createCanvas(800, 600);
  createCanvas(windowWidth, windowHeight);

  for (var i = 0; i < vehiclesNum; i++) {
    vehicles[i] = new Vehicle(random(d * 2, width - d * 2), random(d * 2, height - d * 2));
  }
  for (var i = 0; i < foodPieces; i++) {
    // place the food pieces on the bright spots on an image would be cool implementation
    food.push(createVector(random(width), random(height)));
  }
  for (var i = 0; i < poisonPieces; i++) {
    // place the food pieces on the bright spots on an image would be cool implementation
    poison.push(createVector(random(width), random(height)));
  }
  genCount += 1;
  console.log("Generation: " + genCount);
}

function draw() {
  background(51);
  timer = round(millis() / 1000) - nextTimer;
  if (!tamagotchiMode) {
    if (random(1) < 0.10) { //10% probability to drop more food
      food.push(createVector(random(width), random(height)));
    }

    if (random(1) < 0.01) { //1% probability to drop more poison
      poison.push(createVector(random(width), random(height)));
    }
  }

  for (var i = 0; i < food.length; i++) {
    noStroke();
    fill(0, 255, 0);
    ellipse(food[i].x, food[i].y, 6, 6);
  }

  for (var i = 0; i < poison.length; i++) {
    noStroke();
    fill(255, 0, 0);
    ellipse(poison[i].x, poison[i].y, 6, 6);
  }

  for (var i = vehicles.length - 1; i >= 0; i--) {
    vehicles[i].applyBehaviors(food, poison);
    vehicles[i].boundaries();
    vehicles[i].update();
    vehicles[i].show();

    var newVehicle = vehicles[i].clone();
    if (newVehicle != null) {
      vehicles.push(newVehicle);
    }

    if (vehicles[i].isdead()) {
      if (vehicles.length <= 1) {
        regenerate(vehicles[i]);
      }
      food.push(createVector(vehicles[i].position.x, vehicles[i].position.y));
      vehicles.splice(i, 1);
    }
  }
  fill(255, 100);
  text("Press CTRL to toggle debug on/off - MousePress to add new vehicles", 10, 30);
  if (!tamagotchiMode) {
    fill(255, 100);
    text("Press ALT to enter 'tamagotchi mode'" , 10, 50);
  } else {
    fill(255, 255);
    text("MousePress + 'F' to add food - MousePress + 'P' to add poison. Press ALT to exit 'tamagotchi mode'", 10, 50);
  }
  fill(255, 255);
  text("Dynasty number: " + genCount, 10, 70);
  text("Longevity score: " + timer, 10, 90);
  if (genCount > 1) {
    fill(255, 100)
    text("Longevity record: " + lonRecord, 10, 110);
  }
}

function mousePressed() {
  if (tamagotchiMode && keyIsPressed === true && key === 'f') { // f
    food.push(createVector(mouseX, mouseY));
    console.log("adding food");
  } else if (tamagotchiMode && keyIsPressed === true && key === 'p') { // p
    poison.push(createVector(mouseX, mouseY));
    console.log("adding poison");
  } else {
    vehicles.push(new Vehicle(mouseX, mouseY));
  }
}

function keyPressed() {
  if (keyCode == CONTROL) {
    debug = !debug;
    console.log(debug);
  } else if (keyCode == ALT) {
    tamagotchiMode = !tamagotchiMode;
    console.log(tamagotchiMode);
  }
}

function regenerate(champion) {
  console.log("repopulating");
  var newRecord = timer;
  if (newRecord > lonRecord) {
    lonRecord = timer;
  }
  nextTimer += timer;
  for (n = 0; n < vehiclesNum; n++) {
    vehicles.push(champion.repopulate());
  }
  /* // if we want we could reset all poison/food pieces positions
  console.log("resetting");
  food.splice(0, food.length-1);
  poison.splice(0, poison.length-1);
  for (var i = 0; i < foodPieces; i++) {
    food.push(createVector(random(width), random(height)));
  }
  for (var i = 0; i < poisonPieces; i++) {
    poison.push(createVector(random(width), random(height)));
  }
  */
  genCount += 1;
  console.log("Dynasty: " + genCount);
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
};
