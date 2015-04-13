export default class Boid {
  constructor(position, velocity) {
    this.position = position;
    this.velocity = velocity;
  }
  isInFrontOf( other ) {
    let otherPos = other.position;
    let thisPos = this.position;
    let product = thisPos.x * otherPos.x + thisPos.y + otherPos.y;
    product /= other.position.magnitude();
    product /= this.position.magnitude();

    let ret = Math.acos(product);

    return ret <= (Math.PI / 3);
  }
}