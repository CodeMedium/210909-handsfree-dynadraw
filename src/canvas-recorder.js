/**
 * @see ccapture https://github.com/spite/ccapture.js/
 */
 const framerate = 30
 const timelimit = 20
 window.capturer = new CCapture({
   format: 'webm',
   framerate,
   verbose: true,
   display: true,
   timelimit,
   autoSaveTime: 120
 })
 let numFrames = 0
 let maxFrames = framerate * timelimit
 
 /**
  * Record on keypress
  */
 keypressFn.push(function () {
   if (keyCode === 32) {
     capturer.start()
   }  
 })