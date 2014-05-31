// AudioContext
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var analyser = context.createAnalyser();

//Read wav file
function readWav(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      analyseWav(buffer);
    },  function onError(e) {
      console.log(e)
    });
  }
  request.send();
}

function analyseWav(buffer) {
  
}
// Analyse pcm
function notanalyseWav(buffer) {
  
  var pcmData = new Array ( buffer.length ),
      ampData = new Array();
  
  pcmData = buffer.getChannelData(0);

  var vueltas = Math.floor(pcmData.length / (buffer.sampleRate / 1000 ) );

  for( var i = 0; i <= vueltas; i++) {
    var start = i * 1000;
    var stop = start + 1000;
    ampData[i] = 0;
    for( var x =  start; x <= stop; x++ ) {
      ampData[i] += Math.pow(pcmData[x],2);
    }
    ampData[i] = Math.sqrt(ampData[i]/1000);
  }

   
  var ctx = document.getElementById("myChart").getContext("2d");
  ctx.beginPath();

  for( i = 0; i <= ampData.length; i++) {
    ctx.lineTo(i,ampData[i]/100);
  }

  ctx.stroke();

}


readWav('wav/1.wav');
