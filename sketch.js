//Song
var song, analyzer,fft;
var nameSong = 'Florence.mp3';
//Canvas Background
var rCanvas = 0, gCanvas = 50, bCanvas = 50;
var fps = 30;
var w = window.innerWidth;
var h = window.innerHeight;
// Square
var diameter = 10, isExpanding = true;
var minDiameter = 10, maxDiameter = 35;
var expansionRate = 1 ;//Seconds
var rateGrowth= (maxDiameter-minDiameter)/(fps*expansionRate);


function preload(){
		song = loadSound(nameSong);
}

function setup() {
	//Canvas	
	var canvas = createCanvas(w/2, 500);
	canvas.parent('myContainer');
	frameRate(fps);
	//Sound
	song.play();
	analyzer = new p5.Amplitude();// create a new Amplitude analyzer
	analyzer.setInput(song);// Patch the input to an volume analyzer
	fft = new p5.FFT();
	song.amp(0.2);
	//Graphics
	colorMode(RGB, 255, 255, 255, 1);
	square = new Square();	// Create object
	circle = new Ellipse();
	spect = new Spectrum();	
}

function draw() { //Draw is called every 16ms
	background(rCanvas,gCanvas,bCanvas);
	updateUI();
	square.expand();
	square.levelHeight();
	spect.display();
}

function updateUI(){
	document.getElementById("fps").innerHTML = "FPS: " + Math.floor(frameRate());
	document.getElementById("songStatus").innerHTML = "Song Status: " + song.isPlaying();
	document.getElementById("name").innerHTML = "File Name: " + nameSong;
	document.getElementById("time").innerHTML = "Current Time: "+ timeConvert(Math.ceil(song.currentTime())) + "/" + timeConvert(Math.ceil(song.duration()));

	textSize(16);
	textAlign(RIGHT);
	push();
	translate(song.currentTime()*50,0);
	text('ABCDE', 50, 30);
	pop();
}

/**
 *Takes an integer representing seconds and converts into the HH-MM-SS format then returns that value
 */
function timeConvert(SECONDS){
	var date = new Date(null);
	date.setSeconds(SECONDS); // specify value for SECONDS here
	var result = date.toISOString().substr(11, 8);
	return result;
}

function Square(){ //Square function
	this.expand = function() {
		if(song.isPlaying() == true){
			if(isExpanding == true){
				diameter = diameter + rateGrowth;
				if(diameter > maxDiameter){
					isExpanding = false;
				}
			}
			else if(isExpanding == false){
				diameter = diameter - rateGrowth;
				if(diameter < minDiameter){
					isExpanding = true;
				}
			}
		}
		fill(250,250,250,1);
		rectMode(CENTER);
		rect(w/2-25, 25, diameter, diameter);
	};
	this.levelHeight = function(){
			var level = analyzer.getLevel();
			var levelHeight = map(level, 0, 0.4, 0, height);
			fill(255,0,0);
			rectMode(CORNER);
			rect(0, 500, w/2, -levelHeight-7);
	};
}

function selectSong() {
		song.stop();
    var t = document.getElementById("myFile").value;
		t = t.split(/(\\|\/)/g).pop();

		console.log(t);
		nameSong = t;
		song = null;
		song = loadSound(t,playSong);

}

function playSong(){
	song.playMode('sustain');
	song.play();
}

function Spectrum(){ //1024 is sound spectrum length
	this.display = function(){
		var spectrum = fft.analyze();
		noStroke();
		fill(0,255,0,0.6); // spectrum is green
		rect(0,500,w, -3 );
		for (var i = 0; i< spectrum.length; i++){
			var x = map(i, 0, spectrum.length, 0, w/2);
			var h = -height + map(spectrum[i], 0, 255, height, 0);
			rect(x, height-3, ((w/2) / spectrum.length), h/1.5 );
		
		}
		endShape();
	};
}

function Ellipse(){
	//Amplitude is the magnitude of vibration.
	//Sound is vibration, so its amplitude is is closely related to volume / loudness.
	this.amplitude = function() {
		// Get the average (root mean square) amplitude
		var rms = analyzer.getLevel();
		fill(127);
		stroke(0);
		// Draw an ellipse with size based on volume
		ellipse(50, 50, 10+rms*200, 10+rms*200);
		//setGradient(250,250,diameter,diameter);
	};
}
var test = 0;

function keyPressed(){
	if(keyCode  === 81){
		if (song.isPlaying() ) { // .isPlaying() returns a boolean
			test = song.currentTime();
			console.log(test);
			song.pause();
			rCanvas=0;
			gCanvas=50;
			bCanvas=50;
		}
		else {
			song.play();
			rCanvas=50;
			gCanvas=0;
			bCanvas=50;
		}
	}
}