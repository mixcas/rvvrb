// AudioContext
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();

source = audioContext.createBufferSource();
javascriptNode = audioContext.createScriptProcessor(256, 1, 1);

javascriptNode.onaudioprocess = function() {
  analyze();
}

source.connect(javascriptNode);

// Create filters
var filterFreqs = [
  16,
  31.5,
  63,
  125,
  250,
  500,
  1000,
  2000,
  4000,
  8000,
  16000
];

var filters = [];
var analysers = [];
var timeByteData = [];
soundLevelData = [];

for ( var x = 0; x <= filterFreqs.length; x++ ) {

  filters[x] = audioContext.createBiquadFilter();
  filters[x].type = 2; //BANDPASS
  filters[x].Q.value = 1.414214; //Q = 1.414214 for one octave bands
  filters[x].frequency.value = filterFreqs[x];

  analysers[x] = audioContext.createAnalyser();
  analysers[x].fftSize = 256;

  source.connect(filters[x]);
  filters[x].connect(analysers[x]);
  analysers[x].connect(audioContext.destination);

  timeByteData[x] = new Uint8Array(analysers[x].frequencyBinCount);
  soundLevelData[x] = new Uint8Array(analysers[x].frequencyBinCount);

}

//Read wav file
function readWav(url) {
  
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    source.buffer = audioContext.createBuffer(request.response, false );
  }
  
  request.send();

}

function analyze() {
  for ( var x = 0; x < filterFreqs.length; x++ ) {
    analysers[x].getByteFrequencyData(timeByteData[x]);
    soundLevelData[x] = rms(timeByteData[x]);
  } 
  console.log(soundLevelData[10]);  
}

function rms(ary) {
  var sum_of_squares = bigInt();
  for( var x = 0; x < ary.length; x++) {
    sum_of_squares += Math.pow(ary[x],2);
    //console.log(sum_of_squares);
  }
  
  return Math.sqrt(sum_of_squares / ary.length);
}

function play() {
  javascriptNode.connect(audioContext.destination);
  source.start(0);
}

readWav('wav/2.wav');
