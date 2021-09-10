/**
 * 210909 - Hands-free Dynadraw
 * Remixed by Oz Ramos @TheCodeMedium
 * Remixed sketch: https://editor.p5js.org/golan/sketches/cZPRgx6q9
 * 
 * -----------
 * Golan wrote:
 * -----------
 * This is a rudimentary p5.js 'port' of Paul Haeberli's
 * legendary and monumentally influential program "Dynadraw",
 * which is described at: http://www.sgi.com/grafica/dyna/index.html
 * Originally created in June 1989 by Paul Haeberli (@GraficaObscura)
 * Ported to Processing January 2004 by Golan Levin (@golan)
 * Ported to p5.js September 2021 by Golan Levin.
 *
 * ----------
 * Paul wrote:
 * ----------
 * Here's a really fun and useful hack.
 * The program Dynadraw implements a dynamic drawing technique that applies
 * a simple filter to mouse positions. Here the brush is modeled as a physical
 * object with mass, velocity and friction. The mouse pulls on the brush with
 * a synthetic rubber band. By changing the amount of friction and mass, various
 * kinds of strokes can be made. This kind of dynamic filtering makes it easy
 * to create smooth, consistent calligraphic strokes.
 * 
 * ----------
 * Twitter: https://twitter.com/thecodemedium
 * GitHub: https://github.com/codemedium
 * Pinterest: https://www.pinterest.com/codemedium/
 * Instagram: https://instagram.com/thecodemedium
*/

var px, py;              // current position of spring
var vx, vy;              // current velocity
var ppx, ppy;            // our previous position
var k = 0.06;            // bounciness, stiffness of spring
var damping = 0.88;      // friction
var ductus = 0.5;        // this constant relates stroke width to speed
var max_th = 20.0;       // maximum stroke thickness
var mass = 1;            // mass of simulated pen

// slider params
var sliderh = 25;
var max_K_val = 0.2;
var min_K_val = 0.01;
var max_D_val = 0.999;
var min_D_val = 0.250;
var editing_K = false;
var editing_D = false;

/**
 * Sketch entry point
 */
 function setup() {
  // Param args
  params = Object.assign({
    bg: '#00193c',
    // random(params.colors)
    colors: ['#ffffff', '#ff628c', '#FF9D00', '#fad000', '#2ca300', '#2EC4B6', '#5D37F0', '#00193c', '#00078']
  }, getURLParams())

  createCanvas(windowWidth, windowHeight);
  background(params.bg);
  stroke(0);
  fill(0);
  smooth();  

  ppy = py = height/2;
  ppx = px = width/2;
  vx = vy = 0;
  drawColor = params.colors[1]
  
	createCanvas(windowWidth, windowHeight)
}

//----------------------------------------------------------------
function draw(){

  updateTrace();
  updateSliders();

  drawCredit();
  drawTrace();
  drawSliders();

  ppx = px;                 // Update the previous positions so lines
  ppy = py;                 // can be drawn next time through the loop.
}

//----------------------------------------------------------------
function updateTrace(){
  var dy = py - mouseY;   // Compute displacement from the cursor
  var dx = px - mouseX;
  var fx = -k * dx;       // Hooke's law, Force = - k * displacement
  var fy = -k * dy;
  var ay = fy / mass;     // Acceleration, computed from F = ma
  var ax = fx / mass;
  vx = vx + ax;             // Integrate once to get the next
  vy = vy + ay;             // velocity from the acceleration
  vx = vx * damping;        // Apply damping, which is a force
  vy = vy * damping;        // negatively proportional to velocity
  px = px + vx;             // Integrate a second time to get the
  py = py + vy;             // next position from the velocity
}

//----------------------------------------------------------------
function drawTrace(){

  if (mousePressed){
    var vh = sqrt(vx*vx + vy*vy);                    // Compute the (Pythagorean) velocity,
    var th = max_th - min(vh*ductus, max_th);        // which we use (scaled, clamped and
    th = max(1.0, th);                               // inverted) in computing...
    strokeWeight(th*1.0);                            // ... the stroke weight
    stroke(drawColor);
    strokeCap(ROUND); 
    line (ppx, ppy, px, py);

    if (th > 1.0){                                   // Draw a little ball at the joint
      noStroke();
      fill(drawColor);
      ellipse (px, py, th*1.0, th*1.0);
    }
  }
}

//----------------------------------------------------------------
function mousePressed() {

  var tol = 40;
  var K_x = width*(k - min_K_val)/(max_K_val - min_K_val);
  var D_x = width*(damping - min_D_val)/(max_D_val - min_D_val);
  if ((abs(mouseX - K_x) < tol) && (mouseY > 0) && (mouseY < sliderh)){
    editing_K = true;
    editing_D = false;
  } else if ((abs(mouseX - D_x) < tol) && (mouseY > sliderh) && (mouseY < sliderh*2)){
    editing_D = true;
    editing_K = false;
  } else {
    editing_K = false;
    editing_D = false;
    background (params.bg);
  }
}

//----------------------------------------------------------------
function mouseReleased(){
  editing_K = false;
  editing_D = false;
}

//----------------------------------------------------------------
function updateSliders(){
  if (editing_K){
    var new_K = mouseX/width * (max_K_val - min_K_val) + min_K_val;
    new_K = max(min_K_val, min(max_K_val, new_K));
    k = new_K;
  } else if (editing_D){
    var new_D = mouseX/width * (max_D_val - min_D_val) + min_D_val;
    new_D = max(min_D_val, min(max_D_val, new_D));
    damping = new_D;
  }
  drawSliders();
}

//----------------------------------------------------------------
function drawSliders(){
  stroke(0);
  fill(200);
  strokeWeight(1);
  rect(0, 0, width-1, sliderh*2);
  line(0,sliderh, width-1,sliderh);

  var K_x = width*(k - min_K_val)/(max_K_val - min_K_val);
  var D_x = width*(damping - min_D_val)/(max_D_val - min_D_val);
  line (K_x, 0, K_x, sliderh);
  line (D_x, sliderh, D_x, sliderh*2);

  noStroke();
  fill(110);
  textAlign(RIGHT);
  text("STIFFNESS", K_x-5, sliderh-8);
  text("DAMPING", D_x-5, sliderh*2-8);

  textAlign(LEFT);
  text((""+k), K_x+5, nf(sliderh,1,3)-8);
  text((""+ nf(damping,1,3)), D_x+5, sliderh*2-8);
}

//----------------------------------------------------------------
function drawCredit(){
  fill(255);
  stroke(180);
  rect(-1,height-sliderh,width+1, sliderh);
  fill(180);
  noStroke();
  textAlign(LEFT);
  text("Dynadraw / Paul Haeberli, 1989, port by Golan Levin, made hands-free by Oz Ramos", 5, height-7);
}

//----------------------------------------------------------------
// Notes about this port of Haeberli's Dynadraw.
// This was an extremely quick port that I executed from memory. I didn't actually
// look at Paul's code online; rather, I just ported the main concept. There are
// lots of ways that this port could have been improved (such as the implementation of
// Paul's original chiseled drawing nib). I wanted to keep the code simple, but
// feel free to fork and make improvements as necessary.












/**
 * Handle keypressed across multiple files
 */
function keyPressed () {
  keypressFn.forEach(fn => fn())
}

/**
 * Split keypressed into multiple functions
 * - On my localhost I have another file to record the canvas into a video,
 *   but on OpenProcessing.org this file is not. Locally, the other file
 *   adds another function that starts recording if space is pressed
 * 
 * @see https://github.com/CodeMedium/subdivided-starships
 */
const keypressFn = [function () {
  switch (keyCode) {
    // Space
    case 32:
      break
    // 1
    case 49:
      drawColor = params.colors[1]
      break
    // 2
    case 50:
      drawColor = params.colors[2]
      break
    // 3
    case 51:
      drawColor = params.colors[3]
      break
    // 4
    case 52:
      drawColor = params.colors[4]
      break
    // 5
    case 53:
      drawColor = params.colors[5]
      break
    // 6
    case 54:
      drawColor = params.colors[6]
      break
    // 7
    case 55:
      drawColor = params.colors[7]
      break
  }
}]
