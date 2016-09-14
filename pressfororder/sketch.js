/* 
Kinetic typography: experimenting with text strings and single characters 
A variation from Example 17-6: Text breaking up of Learning Processing book by Daniel Shiffman http://www.learningprocessing.com
Inspired by Jhon Maeda's 1955 Flying Letters.
*/

var message = "mouse pressed or touch down, to make order out of chaos";

// An array of Letter objects
var letters;

// Global variables for x and y position of the text for dynamic resize of the window
var x, y;

function setup() {
  var mycanvas = createCanvas(windowWidth, windowHeight);

  // Load the font
  textFont("Arial", 20);
  //textFont("Anonymous Pro", 20); // char spacing not working as it should here. Any suggestions?

  // Create the array the same size as the String
  letters = [];

  /* Calling a function to initialize Letters at the correct location:
   a function I can call whenever the dimensions of the window change,
   to dynamically re-adjust te position of my text message.
   */
  initialization();
}

function draw() {
  background(255, 0, 0);
  for (var i = 0; i < letters.length; i++) {

    // Display all letters
    letters[i].display();

    // If the mouse is pressed the letters shake
    // If not, they return to their original location
    if (mouseIsPressed || touchIsDown) {
      letters[i].home();
    } else {
      letters[i].shake();
    }
  }
}

function initialization() {
  x = width / 2 - int(textWidth(message) / 2); // if I want it centered whatever the size of the sketch...
  y = height / 2;
  for (var i = 0; i < message.length; i++) {
    // Letter objects are initialized with their location within the String as well as what character they should display.
    letters[i] = new Letter(x, y, message.charAt(i));
    x += textWidth(message.charAt(i));
    letters[i].randomizeLetters(); // randomize initial x and y position
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initialization();
}