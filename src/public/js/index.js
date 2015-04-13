import ticker from './ticker';
import Boids from './boids';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const boids = new Boids();

document.getElementById('react-main-mount')
  .appendChild(canvas);

ticker().on('tick', () => {
  boids.stepFrame()
}).on('draw', () => {
  let halfHeight = canvas.height/2;
  let halfWidth = canvas.width/2;
  ctx.fillStyle = '#696';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#900';

  let boidsSprites = boids.boids;
  let len = boidsSprites.length;
  let x;
  let y;

  for ( var i = 0; i < len; i++ ) {
    x = boidsSprites[i].position.x;
    y = boidsSprites[i].position.y;

    boidsSprites[i].position.x = x > halfWidth ? -halfWidth : -x > halfWidth ? halfWidth : x;
    boidsSprites[i].position.y = y > halfHeight ? -halfHeight : -y > halfHeight ? halfHeight : y;
    ctx.fillRect(x + halfWidth, y + halfHeight, 1, 1);
  }
});