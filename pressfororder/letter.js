// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 17-6: Text breaking up 

function Letter(x, y, letter) {
  // The object knows its original " home " location
  // As well as its current location
  this.homex = this.x = x;
  this.homey = this.y = y;
  this.letter = letter;

  /* variables for easing:
  step = size of each easing step
  pct = percentage of step travelled
  */
  this.step = random(0.005, 0.05);
  this.pct = 0.0;

  // Display the letter
  this.display = function() {
    fill(255);
    textAlign(LEFT);
    text(this.letter, this.x, this.y);
  }

  // Move the letter randomly but keep them inside a certain area
  this.shake = function() {
    this.x += random(-2, 2);
    this.y += random(-2, 2);
    this.x = constrain(this.x, 100, width - 100);
    this.y = constrain(this.y, 100, height - 100);
  }

  // At any point, the current location can be set back to the home location with easing  by calling the home() function.
  this.home = function() {
    if (this.pct < 1.0) {
      this.x = this.x + ((this.homex - this.x) * this.pct);
      this.y = this.y + ((this.homey - this.y) * this.pct);
      this.pct += this.step;
    } else {
      this.pct = 0.0;
    }
    //this.x = this.homex;
    //this.y = this.homey;
  }

  this.randomizeLetters = function() {
    this.x = random(95, width - 95);
    this.y = random(95, height - 95);
  }
}