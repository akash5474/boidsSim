export default class Vector {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
  distanceTo( vect ) {
    return Math.sqrt(
      Math.pow(this.x - vect.x, 2)
      + Math.pow(this.y - vect.y, 2)
    );
  }
  magnitude() {
    return this.distanceTo(new Vector());
  }
  add( vect ) {
    return new Vector(this.x + vect.x, this.y + vect.y);
  }
  subtract( vect ) {
    return new Vector(this.x - vect.x, this.y - vect.y);
  }
  multiplyBy( n ) {
    return new Vector(this.x * n, this.y * n);
  }
  divideBy( n ) {
    return new Vector(this.x / n, this.y / n);
  }
  normalize() {
    let magnitude = this.magnitude();

    if ( magnitude === 0 ) return new Vector();

    return this.divideBy( magnitude );
  }
  limit( n ) {
    if ( this.magnitude() < n ) return this;

    return this.normalize().multiplyBy(n);
  }
}