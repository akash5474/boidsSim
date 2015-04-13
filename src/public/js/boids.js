import Vector from './vector';
import Boid from './boid';

let disperse = true;
function setDisperse() {
  function interval() {
    let len = disperse ? 3000 : 7000;

    setTimeout(() => {
      disperse = !disperse;
      // interval();
    }, len);
  };

  interval();
}

setDisperse();

export default class Boids {
  constructor() {
    this.speedLimit = 0.3;
    this.maxBoids = 50;
    this.boids = [];
    this.maxNeighborDist = 12;
    this.minNeighborDist = 6;
    this.centerMult = 1;
    this.distMult = 1.5;
    this.velocityMult = 1;
    this.accelLimit = 0.3;
    this.attractor = new Vector(300, 200);

    for ( let i = 0; i < this.maxBoids; i++ ) {
      this.boids.push(new Boid(
        new Vector(Math.random()*30 - 10, Math.random()*30 - 10),
        new Vector()
      ));
    }

  }
  toCenterRule(skipIdx) {
    let boids = this.boids;
    let skipBoid = this.boids[skipIdx];
    let total = new Vector(0, 0);
    let neighbors = 0;

    boids.forEach((boid, idx) => {
      if ( skipIdx === idx ) return;
      if ( skipBoid.position.distanceTo( boid.position ) < this.maxNeighborDist //) {
        && boid.isInFrontOf( skipBoid ) ) {
        total = total.add( boid.position );
        neighbors++;
      }
    });

    if (neighbors === 0) return new Vector();

    total = total.divideBy( neighbors );
    return total.subtract( skipBoid.position ).normalize()
      .subtract( skipBoid.velocity )
      .limit( this.accelLimit );
  }
  keepDistRule(skipIdx) {
    let boids = this.boids;
    let skipBoid = boids[skipIdx];
    let total = new Vector(0, 0);
    let neighbors = 0;

    boids.forEach((boid, idx) => {
      if ( skipIdx === idx ) return;
      if ( skipBoid.position.distanceTo( boid.position ) < this.minNeighborDist ) {

        total = total.subtract(
          boid.position
          .subtract(skipBoid.position)
          .normalize()
          .divideBy(
            boid.position.distanceTo(skipBoid.position)
          )
        );
        neighbors++;
      }
    });

    if ( neighbors === 0 ) return new Vector();

    total = total.divideBy(neighbors)
      .normalize().add(skipBoid.velocity)
      .limit( this.accelLimit );
    // console.log(total);
    return total;
  }
  matchVelocityRule(skipIdx) {
    let boids = this.boids;
    let skipBoid = boids[skipIdx];
    let total = new Vector();
    let neighbors = 0;

    boids.forEach((boid, idx) => {
      if ( skipIdx === idx ) return;
      if ( skipBoid.position.distanceTo( boid.position ) < this.maxNeighborDist ) {
        // && boid.isInFrontOf( skipBoid ) ) {
        total = total.add(boid.velocity);
        neighbors++;
      }
    });

    if ( neighbors === 0 ) return new Vector();

    return total.divideBy(neighbors)
      .normalize().subtract(skipBoid.velocity)
      .limit( this.accelLimit );
  }
  stepFrame() {
    let boids = this.boids;
    for ( let idx = 0; idx < boids.length; idx++ ) {
      let boid = boids[idx];
      let centerVect = disperse ?
        this.toCenterRule(idx).multiplyBy(this.centerMult) * -1
        : this.toCenterRule(idx).multiplyBy(this.centerMult);

      let keepDistVect = this.keepDistRule(idx).multiplyBy(this.distMult);
      let matchVelocityVect = disperse ? boid.velocity
        : this.matchVelocityRule(idx).multiplyBy(this.velocityMult);


      // let attractorVect = this.attractor.normalize()
      //   .subtract(boid.position)
      //   .limit(this.accelLimit);

      boid.velocity = boid.velocity.add(centerVect).add(keepDistVect)
        .add(matchVelocityVect)

      // if ( boid.position.distanceTo(this.attractor) < 60 ) {
      //   boid.velocity = boid.velocity.add(attractorVect)
      // }
      boid.velocity = boid.velocity.limit(this.speedLimit);
      boid.position = boid.position.add(boid.velocity);
    }
  }
}