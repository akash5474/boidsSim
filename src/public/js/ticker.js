import { EventEmitter } from 'events';

export default function ticker(element) {
  let fps = 1000 / 60;
  let emitter = new EventEmitter();
  let prevTime = Date.now();
  let elapsedTime = 0;
  let limit = 2;

  function stepFrame() {
    global.requestAnimationFrame(stepFrame, element);

    let currTime = Date.now();
    let dt = currTime - prevTime;
    let steps = limit;

    elapsedTime += dt;

    while ( elapsedTime > dt && steps ) {
      steps -= 1;
      elapsedTime -= fps;

      emitter.emit('tick');
    }

    elapsedTime = ( elapsedTime + fps * 1000 ) % fps;
    if ( steps !== limit ) {
      emitter.emit('draw');
    }
    prevTime = currTime;
  }

  stepFrame();

  return emitter;
};