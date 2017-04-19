// The "Vehicle" class
var mr = 0.1; // arbitrary mutation rate // 10% chance of mutation

function Vehicle(x, y, dna) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 4;
  this.maxspeed = 5;
  this.maxforce = 0.5;

  this.health = 1.0; // health of each vehicle will be btw 0 and 1

  this.dna = [];
  if (dna === undefined) { // if I don't pass in an array with a given dna, make one randomly
    // Food weight
    this.dna[0] = random(-2, 2);
    // Poison weight
    this.dna[1] = random(-2, 2);
    // Food perception
    this.dna[2] = random(10, 100);
    // Poison perception
    this.dna[3] = random(10, 100);
  } else {
    for (var i = 0; i < dna.length; i++) {
      this.dna[i] = dna[i]; // just cloning
      if (random(1) < mr) {
        if (i < 2) { // Adjust steering force weights
          this.dna[i] += random(-0.2, 0.2);
        } else if (i >= 2) { // Adjust perception radius
          this.dna[i] += random(-10, 10);
          this.dna[i] = constrain(this.dna[i], 0, 100); // to prevent the value goind below 0
        }
      }
    }
  }

  // Method to update location
  this.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);

    // Slowly die unless you eat
    this.health -= 0.002;
  };

  // A function to handle multiple beaviors
  this.applyBehaviors = function(good, bad) {
    var steerG = this.eat(good, 0.06, this.dna[2]); // food, healt increment
    var steerB = this.eat(bad, -0.5, this.dna[3]); // poison, healt decrement

    //Weightning forces based on vehicle's DNA
    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  };

  this.clone = function() {
    var r = random(1);
    if (r < 0.001 && this.health > 0.5) { //chaches for a vehicle to reproduce itself are determined by probability and health status
      return new Vehicle(this.position.x, this.position.y, this.dna);
    } else {
      return null;
    }
  }

  this.repopulate = function() {
      //return new Vehicle(this.position.x, this.position.y, this.dna);
      return new Vehicle(random(d * 2, width - d * 2), random(d * 2, height - d * 2), this.dna);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.seek = function(target) {
    var desired = p5.Vector.sub(target, this.position); // A vector pointing from this object's position to the target
    // Scale to maximum speed
    desired.setMag(this.maxspeed);
    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    //this.applyForce(steer);
    return steer;
  };

  //
  // STEER = DESIRED MINUS VELOCITY
  this.eat = function(list, hvalue, perception) { // hvalue is the health increment/decrement
    var record = Infinity; // let's start with a huge record numeber (infinity = javascript keyword)
    var closest = null;
    for (var i = list.length - 1; i >= 0; i--) {
      var d = p5.Vector.dist(list[i], this.position); // going through all the food pieces finding our which one is the closest one
      // if a vehicle stumble upon food or poison even by chance or because it's cheasing it, he's gonna eat that piece
      if (d < this.maxspeed) { // this.maxspeed = 5; I use maxspeed correspondent value to prevent vehicle "jumping" the food/poison piece
        list.splice(i, 1);
        this.health += hvalue;
      } else if (d < record && d < perception) { // this is going to be true only if distance is also within my vehicle's perception of Food/Poison
        record = d; // our new record
        closest = list[i]; // the closest item form the list is now this piece of food
      }
    }
    if (closest != null) {
      return this.seek(closest); // will also exit the function
    }
    return createVector(0, 0);
  };

  // a function to determine is a vehicle is dead
  this.isdead = function() {
    return (this.health < 0);
  }

  /// utility methods
  this.boundaries = function() {
    var desired = null;

    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }
    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }
    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  };

  this.show = function() {
    // Draw a triangle rotated in the direction of velocity
    var angle = this.velocity.heading() + PI / 2; // https://p5js.org/reference/#/p5.Vector/heading

    // Color based on health
    var green = color(0, 255, 0);
    var red = color(255, 0, 0);
    var col = lerpColor(red, green, this.health); // https://p5js.org/reference/#/p5/lerpColor
    var alphy = lerp(50, 100, this.health); // https://p5js.org/reference/#/p5/lerp

    fill(col);
    noStroke();
    strokeWeight(1);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    if (debug) {
      // drawing the lines to see the DNA of this vehicle
      noFill();
      strokeWeight(4);
      stroke(0, 255, 0, alphy);
      line(0, 0, 0, -this.dna[0] * 15); // visulaizing FOOD Steer force for this vehicle
      ellipse(0, 0, this.dna[2] * 2); // visulaizing FOOD perception range
      strokeWeight(2);
      stroke(255, 0, 0, alphy);
      line(0, 0, 0, -this.dna[1] * 15); // visulaizing POISON Steer force for this vehicle
      ellipse(0, 0, this.dna[3] * 2); // visulaizing POISON perception range
    }
    pop();
  };

  this.bounceedges = function() {
    if (this.position.x < 0 || this.position.x > width) {
      this.velocity.x *= -1;
    }
    if (this.position.y < 0 || this.position.y > height) {
      this.position.y *= -1;
    }
  };

  this.wrapedges = function() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  };

}
