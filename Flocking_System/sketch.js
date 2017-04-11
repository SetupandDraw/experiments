// in progress implementation of a flocking system based on The Nature of Code by Daniel Shiffman
// http://natureofcode.com

// Separation
// Via Reynolds: http://www.red3d.com/cwr/steer/

// A list of vehicles
var vehicles = [];

var slider1, slider2, slider3, slider4;

var p1, p2, p3, text;

function setup() {
    createCanvas(640, 360);
    // We are now making random vehicles and storing them in an array
    for (var i = 0; i < 300; i++) {
        vehicles.push(new Vehicle(random(width), random(height)));
    }
    createSpan('Separate Force');
    slider1 = createSlider(0, 8, 4, 0.1); // separateForce
    createSpan('Seek Force');
    slider2 = createSlider(0, 8, 4, 0.1); // seekForce
    createSpan('Desired Separation');
    slider3 = createSlider(10, 160, 25); // desired separation
    createSpan('desired separation');
    slider4 = createSlider(0.5, 1.5, 1.22, 0.1); // controlling the size of my vehicles

    text = createP("Drag the mouse to generate new vehicles.");

    p1 = createP("Separate Force: " + slider1.value());
    p2 = createP("Seek Force: " + slider2.value());
    p3 = createP("Desired Separation: " + slider3.value());

    console.log(p1);
    p1.id("myid");

    slider1.changed(function() {
        doSomething(this, p1, "Separate Force: ");
    });
    slider2.changed(function() {
        doSomething(this, p2, "Seek Force: ");
    });
    slider3.changed(function() {
        doSomething(this, p3, "Desired Separation: ");
    });

    slider4.input(function() {
        //scaleVheicles(this.value());
    });

}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        for (var i = 0; i < vehicles.length; i++) {
            vehicles[i].r *= 2;
        }
    } else if (keyCode === DOWN_ARROW) {
        for (var i = 0; i < vehicles.length; i++) {
            vehicles[i].r *= 0.5;
        }
    }
}

function doSomething(wslider, wparagraph, txt) {
    //console.log(wparagraph); //console.log(wparagraph.elt.id);
    /* for testing purposes only
    //console.log(wparagraph.elt.id);
    //var textmessage = document.getElementById(wparagraph.elt.id).innerHTML;
    //console.log(textmessage);
    */
    wparagraph.html(txt + wslider.value());
}

function draw() {
    background(51);
    var performances = Math.round(frameRate());
    text.html("Drag the mouse to generate new vehicles." + "    " + "Frame Rate: " + Math.round(frameRate()));

    for (var i = 0; i < vehicles.length; i++) {
        vehicles[i].applyBehaviors(vehicles);
        vehicles[i].update();
        vehicles[i].borders();
        vehicles[i].display();
    }

    if (performances < 40 && frameCount > 100) {
        //console.log("removing vehicles. Vehicles num: " + vehicles.length);
        vehicles.splice(0, 1);
    }

}

function mouseDragged() {
    vehicles.push(new Vehicle(mouseX, mouseY));
}
