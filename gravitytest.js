// for canvas
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
// for time between frames
let lastTime = 0;
let changeInTime;

// for controls
//document.addEventListener("mousemove", mouseMoveHandler);
//document.addEventListener("mousedown", mouseDownHandler);
//document.addEventListener("mouseup", mouseUpHandler);
document.addEventListener("click", mouseClickHandler);
let mouseDown = false;
let mousePosX, mousePosY;

// array of spheres w/ x, y, radius, dx, dy
let spheres = [];
let selectedSphere = 0;
// sphere that the user makes is stored here until pushed to array
let tempSphere = { x: 0, y: 0, radius: 0, dx: 0, dy: 0 }; 

// app states
let playing = false;

// gravity constant
const gravity = 5000;

function setPlaying() {
	// flip the state 
	playing = !playing;
	// change button text
	if (playing) {
		document.getElementById("run-button").value = "Pause Simulation";
	}
	else {
		document.getElementById("run-button").value = "Run Simulation";
	}
}

/*
function mouseMoveHandler(e) {	
	// if user is dragging
	mousePosX = e.clientX - canvas.offsetLeft;
	mousePosY = e.clientY - canvas.offsetTop;
}

function mouseDownHandler(e) {	
	// make sure mouse is on canvas
	if (e.clientX - canvas.offsetLeft < canvas.width && e.clientX - canvas.offsetLeft > 0 && e.clientY - canvas.offsetTop < canvas.height) {			
		// if user just clicked, reset tempSphere
		if (!mouseDown) {
			tempSphere.x = e.clientX - canvas.offsetLeft;
			tempSphere.y = e.clientY - canvas.offsetTop;
			tempSphere.radius = 0;		
		}
		mouseDown = true;
	}
	
}

function mouseUpHandler(e) {
	// make sure mouse is on canvas
	if (e.clientX - canvas.offsetLeft < canvas.width && e.clientX - canvas.offsetLeft > 0 && e.clientY - canvas.offsetTop < canvas.height) {			
		mouseDown = false;
		spheres.push({ x: tempSphere.x, y: tempSphere.y, radius: tempSphere.radius, dx: tempSphere.dx, dy: tempSphere.dy });	
	}
}
*/

function mouseClickHandler(e) {
	// check if on canvas
	if (e.clientX - canvas.offsetLeft < canvas.width && e.clientX - canvas.offsetLeft > 0 && e.clientY - canvas.offsetTop < canvas.height) {			
		// set mouse pos
		mousePosX = e.clientX - canvas.offsetLeft;
		mousePosY = e.clientY - canvas.offsetTop;
		// check what sphere was clicked
		for (let i = 0; i < spheres.length; ++i) {
			// check if mouse pos is in sphere
			// if dist between sphere and mouse is less than radius
			if ( Math.sqrt( Math.pow(mousePosX - spheres[i].x, 2) + Math.pow(mousePosY - spheres[i].y, 2) ) < spheres[i].radius) {
				selectedSphere = i;
				document.getElementById("inX").value = String(spheres[i].x);
				document.getElementById("inY").value = String(spheres[i].y);
				document.getElementById("inDX").value = String(spheres[i].dx);
				document.getElementById("inDY").value = String(spheres[i].dy);
				break;
			}
		}
	}
}

// set selected sphere properties to those in editor
function updateSelectedSphere() {
	// if the selected sphere actually exists
	if (spheres.length != 0 && selectedSphere != null) {
		spheres[selectedSphere].x = Number(document.getElementById("inX").value);
		spheres[selectedSphere].y = Number(document.getElementById("inY").value);
		spheres[selectedSphere].dx = Number(document.getElementById("inDX").value);
		spheres[selectedSphere].dx = Number(document.getElementById("inDY").value);
	}
}

function addSphere(x, y, r, dx, dy) {
	spheres.push({ x: x, y: y, radius: r, dx: dx, dy: dy });
}

// update velocity based on other spheres
// pass the other spheres and id to know which one to skip
function updateVelocity(spheres, sphereID) {
	
	for (let i = 0; i < spheres.length; ++i) {
		// as long as not sphere currently working on
		if (i != sphereID) {
			
			// get dist
			let distDot = spheres[i].x * spheres[sphereID].x + spheres[i].y * spheres[sphereID].y; // found using dot product
			let distSqrt = Math.sqrt(Math.pow(spheres[i].x - spheres[sphereID].x, 2) + Math.pow(spheres[i].y - spheres[sphereID].y, 2)); // found using pythag theorem
			
			let forceDirX = (spheres[i].x - spheres[sphereID].x) / distSqrt; // divide by dist to get normalized version
			let forceDirY = (spheres[i].y - spheres[sphereID].y) / distSqrt;
			
			let forceX = forceDirX * gravity * spheres[i].radius / distDot;
			let forceY = forceDirY * gravity * spheres[i].radius / distDot;
			 
			// inc velo w/ accel * dt
			spheres[sphereID].dx += forceX * changeInTime;
			spheres[sphereID].dy += forceY * changeInTime;
		}
	}
	
}

// update position based on force of body
function updatePos(array) {
	
	for (let i = 0; i < array.length; ++i ) {
		array[i].x += array[i].dx;
		array[i].y += array[i].dy;
	}
	
}

function drawCircle(x, y, r, color) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI*2, false);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawSpheres(array) {
	for (let i = 0; i < array.length; ++i) {
		if (i == selectedSphere) {
			drawCircle(array[i].x, array[i].y, array[i].radius, "green");
		} 
		else {
			drawCircle(array[i].x, array[i].y, array[i].radius, "red");
		}		
	}
}

function drawLines(array) {
	for (let i = 0; i < array.length; ++i) {
		ctx.beginPath();
		// draw dx
		ctx.fillStyle = "blue";
		ctx.moveTo(array[i].x, array[i].y);
		ctx.lineTo(array[i].x + array[i].dx * 20, array[i].y);
		ctx.stroke();
		// draw dy
		ctx.fillStyle = "green";
		ctx.moveTo(array[i].x, array[i].y);
		ctx.lineTo(array[i].x, array[i].y + array[i].dy * 20);
		ctx.stroke();
		// draw both
		ctx.fillStyle = "red";
		ctx.moveTo(array[i].x, array[i].y);
		ctx.lineTo(array[i].x + array[i].dx * 20, array[i].y + array[i].dy * 20);
		ctx.stroke();
	}
}

function updateTime(newTime) {
	
	changeInTime = (newTime - lastTime) * 0.001;
	lastTime = newTime;
	
}

// main loop
function draw(time) {
	// clear screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	updateTime(time);
	
	// if the simulation is running
	if (playing) {
		//updateSelectedSphere();
		for (let i = 0; i < spheres.length; ++i) {
			updateVelocity(spheres, i);
		}	
		updatePos(spheres);
	}
	// if user wants to edit
	else {
		updateSelectedSphere();
	}
	drawSpheres(spheres);
	//drawLines(spheres); // debug
	
	/*// if user is creating a new sphere, draw it
	if (mouseDown) {
		// draw circle
		drawCircle(tempSphere.x, tempSphere.y, tempSphere.radius);
		// grow sphere
		tempSphere.radius += 10 * changeInTime;
		// set dx, dy
		tempSphere.dx = (tempSphere.x - mousePosX) * 0.1;
		tempSphere.dy = (tempSphere.y - mousePosY) * 0.1;
		// draw dx, dy		
		ctx.beginPath();
		ctx.moveTo(tempSphere.x, tempSphere.y);
		ctx.lineTo(mousePosX, mousePosY);
		ctx.stroke();
	}
	*/
	
	/*
	if (gai) {
		
		spheres[0].x = Number(document.getElementById("inX").value);
		spheres[0].y = Number(document.getElementById("inY").value);
		
		console.log("X: " + spheres[0].x);
		console.log("Y: " + spheres[0].y);
		
		//spheres[0].x = 100;
		//spheres[0].y = 100;
	}
	*/
	
	// rerun
	requestAnimationFrame(draw);
}

addSphere(100, 100, 10, 0, 0);
addSphere(100, 200, 10, 0, 0);
addSphere(200, 200, 10, 0, 0);
// needed to start program
draw(16);