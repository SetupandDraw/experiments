/*
In progress Implementation of a flocking system based on The Nature of Code by Daniel Shiffman
http://natureofcode.com
Simulating group behaviors by combining multiple steering behaviors according to local interactions between vehicles.
more: Craig  Reynolds: http://www.red3d.com/cwr/steer/
*/

// A list of vehicles
var vehicles = [];

var slider1, slider2, slider3, slider4;

var p1, p2, p3, mytext;

function setup() {
    createCanvas(windowWidth, 460);
    // We are now making random vehicles and storing them in an array
    for (var i = 0; i < 300; i++) {
        vehicles.push(new Vehicle(random(width), random(height)));
    }
    createSpan('Separation');
    slider1 = createSlider(0, 4, 1.5, 0.1); // separateForce
    createSpan('Align');
    slider2 = createSlider(0, 2, 1.0, 0.1); // alignForce
    createSpan('Cohesion');
    slider3 = createSlider(0, 2, 1.0, 0.1); // cohesionForce
    //createSpan('desired separation');
    //slider4 = createSlider(0.5, 1.5, 1.22, 0.1); // controlling the size of my vehicles

    mytext = createP("Drag the mouse to generate new vehicles.");

    p1 = createP("Separation Force: " + slider1.value());
    p2 = createP("Align Force: " + slider2.value());
    p3 = createP("Cohesion Force: " + slider3.value());


    slider1.changed(function() {
        updateText(this, p1, "Separation Force: ");
    });
    slider2.changed(function() {
        updateText(this, p2, "Align Force: ");
    });
    slider3.changed(function() {
        updateText(this, p3, "Cohesion Force: ");
    });
    /*
    slider4.input(function() {
        //scaleVheicles(this.value());
    });
    */
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

function updateText(wslider, wparagraph, ttxt) {
    //console.log(wparagraph);
    /* for testing purposes only
    //console.log(wparagraph.elt.id);
    //var textmessage = document.getElementById(wparagraph.elt.id).innerHTML;
    //console.log(textmessage);
    */
    wparagraph.html(ttxt + wslider.value());
}

function draw() {
    background(51);
    var performances = Math.round(frameRate());
    mytext.html("Drag the mouse to generate new vehicles." + "  //  " + "Frame Rate: " + Math.round(frameRate()) + "  //  " + "If frame rate becomes ");

    for (var i = 0; i < vehicles.length; i++) {
        vehicles[i].applyBehaviors(vehicles);
        vehicles[i].update();
        vehicles[i].borders();
        vehicles[i].display();
    }

    if (performances < 30 && frameCount > 100) {
        //console.log("removing vehicles. Vehicles num: " + vehicles.length);
        vehicles.splice(0, 1);
    }

}

function mouseDragged() {
    vehicles.push(new Vehicle(mouseX, mouseY));
}

function windowResized() {
  resizeCanvas(windowWidth, 4);
}
