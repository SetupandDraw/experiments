/*
In progress implementation of a flocking system based on The Nature of Code by Daniel Shiffman
http://natureofcode.com
Simulating group behaviors by combining multiple steering behaviors according to local interactions between vehicles.
more: Craig  Reynolds: http://www.red3d.com/cwr/steer/
*/

// Vehicle object
function Vehicle(x, y) {
    // All the usual stuff
    this.position = createVector(x, y);
    this.r = 2; // this.r = random(2, 12); // also used as mass
    this.maxspeed = 3; // Maximum speed
    this.maxforce = 0.2; // Maximum steering force
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);

    this.applyBehaviors = function(vehicles) {

        var separationForce = this.separate(vehicles); // Separation
        var alignForce = this.align(vehicles); // Alignment
        var cohesionForce = this.cohesion(vehicles); // Cohesion
        //var seekForce = this.seek(createVector(mouseX, mouseY));

        // weighting all the forces
        separationForce.mult(slider1.value());
        alignForce.mult(slider2.value());
        cohesionForce.mult(slider3.value());
        //seekForce.mult(slider2.value());

        // apply all the force vectors to the acceleration
        this.applyForce(separationForce);
        this.applyForce(alignForce);
        this.applyForce(cohesionForce);
        //this.applyForce(seekForce);
    }

    this.applyForce = function(force) {
        // We could add mass here if we want A = F / M
        var f = force.copy();
        f.div(this.r);
        this.acceleration.add(f);
        //this.acceleration.add(force);
    }

    // Separation
    // Method checks for nearby vehicles and steers away
    this.separate = function(vehicles) {
        var desiredseparation = 50; //slider3.value(); // SETTING THE ACTIVATION RANGE FOR THE BEAVIOR
        var sum = createVector();
        var count = 0;
        // For every boid in the system, check if it's too close
        for (var i = 0; i < vehicles.length; i++) {
            var d = p5.Vector.dist(this.position, vehicles[i].position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                var diff = p5.Vector.sub(this.position, vehicles[i].position);
                diff.normalize();
                diff.div(d); // Weight by distance
                sum.add(diff);
                count++; // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            sum.div(count);
        }
        if (sum.mag() > 0) {
            // Our desired vector is the average scaled to maximum speed
            sum.normalize();
            sum.mult(this.maxspeed);
            // Implement Reynolds: Steering = Desired - Velocity
            sum.sub(this.velocity);
            sum.limit(this.maxforce);
        }
        return sum;
    }

    // Alignment
    // For every nearby vehicle in the system calcutates the average velocity
    this.align = function(vehicles) {
        var neighbordist = 50; // slider2.value(); // SETTING THE ACTIVATION RANGE FOR THE BEAVIOR
        var sum = createVector();
        var count = 0;
        // For every boid in the system, check if it's in the range
        for (var i = 0; i < vehicles.length; i++) {
            var d = p5.Vector.dist(this.position, vehicles[i].position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < neighbordist)) {
                // Sum the velocity vector of all the neighbors of this vehicle
                sum.add(vehicles[i].velocity);
                count++; // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            sum.div(count);
            // Our desired vector is the average scaled to maximum speed
            sum.normalize();
            sum.mult(this.maxspeed);
            // Implement Reynolds: Steering = Desired - Velocity
            sum.sub(this.velocity);
            sum.limit(this.maxforce);
        }
        return sum;
    }

    // Cohesion (stay together to an average center)
    // For the average location of all nearby neighbors, calculate the steering force
    this.cohesion = function(vehicles) {
        var neighbordist = 50; // slider3.value(); // SETTING THE ACTIVATION RANGE FOR THE BEAVIOR
        var sum = createVector();
        var count = 0;
        // For every boid in the system, check if it's in the range
        for (var i = 0; i < vehicles.length; i++) {
            var d = p5.Vector.dist(this.position, vehicles[i].position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < neighbordist)) {
                // Sum the position vector of all the neighbors of this vehicle
                sum.add(vehicles[i].position);
                count++; // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            sum.div(count);
            // Our desired vector is the average scaled to maximum speed
            return this.seek(sum); // the target is defined by the average position of all the vehicles
          } else {
            return createVector();
          }
    }

    // Seek
    // A method that calculates a steering force towards a target
    this.seek = function(target) {
        var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxspeed);
        // Steering = Desired minus velocity
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce); // Limit to maximum steering force
        return steer;
    }

    // Method to update location
    this.update = function() {
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        // Reset accelertion to 0 each cycle
        this.acceleration.mult(0);
    }

    this.display = function() {
        // draw a triangle rotated in the direction of
        var theta = this.velocity.heading() + PI / 2 // https://p5js.org/reference/#/p5.Vector/heading
        fill(200);
        noStroke();
        push();
        translate(this.position.x, this.position.y);
        //ellipse(0, 0, this.r, this.r);
        rotate(theta);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }

    // Wraparound
    this.borders = function() {
        if (this.position.x < -this.r) this.position.x = width + this.r;
        if (this.position.y < -this.r) this.position.y = height + this.r;
        if (this.position.x > width + this.r) this.position.x = -this.r;
        if (this.position.y > height + this.r) this.position.y = -this.r;
    }
}
