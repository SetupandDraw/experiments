class Cell{
  constructor(x_, y_, state_){
    this.s = resolution;
    this.pos = createVector(x_, y_);
    //this.state = state_ || floor(random(2));
    this.state = state_;
  }

  update(newState){
    this.state = newState;
  }

  show(){
    if (this.state == 1) {
      //console.log("x = " + this.pos.x + "y = " +this.pos.y);
      fill(255);
    } else if (this.state == 0)  {
      noFill();
    }
    else {
      fill(255, 0, 0);
    }
    rect(this.pos.x , this.pos.y, this.s, this.s);
  }
}
