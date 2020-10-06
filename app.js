var canvas = document.querySelector('canvas');
var statusText = document.querySelector('#statusText');
var sensorselect = document.getElementById("sensorselect");

statusText.addEventListener('click', function() {
  statusText.textContent = 'connecting...';
  heartRates = [];
  options =[];
  heartRateSensor.connect()
  .then(() => addList());
  //.then(() => heartRateSensor.startNotificationsHeartRateMeasurement().then(handleHeartRateMeasurement))
//  .catch(error => {
  //  statusText.textContent = error;
  //});
//  dropdown.style.visibility = "visibile";



});
sensorselect.addEventListener('change', function() {
heartRates = [];
  options =[];
var j;
 for ( j=1; j< heartRateSensor.options.length; j++)
 {
   heartRateSensor.stopNotificationsHeartRateMeasurement(j);
    }
    
 heartRateSensor.startNotificationsHeartRateMeasurement(sensorselect.selectedIndex).then(handleHeartRateMeasurement);
//  .catch(error => {
  //  statusText.textContent = error;
  //});

});
function addList(){
  var i;
  sensorselect.style.visibility = "visibile";
  for( i=0; i< heartRateSensor.options.length; i++)
 {
   var option = document.createElement("option");
   option.text=heartRateSensor.options[i].uuid;
   sensorselect.add(option,sensorselect[i+1]);
 }
 statusText.textContent = 'Select Sensor...';
}
function handleHeartRateMeasurement(heartRateMeasurement) {
  heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
    var heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value);
    statusText.innerHTML = heartRateMeasurement;
    heartRates.push(heartRateMeasurement);
    drawWaves();
  });
}

var heartRates = [];
var mode = 'line';

canvas.addEventListener('click', event => {
  mode = mode === 'bar' ? 'line' : 'bar';
  drawWaves();
});

function drawWaves() {
  requestAnimationFrame(() => {
    canvas.width = parseInt(getComputedStyle(canvas).width.slice(0, -2)) * devicePixelRatio;
    canvas.height = parseInt(getComputedStyle(canvas).height.slice(0, -2)) * devicePixelRatio;

    var context = canvas.getContext('2d');
    var margin = 2;
    var max = Math.max(0, Math.round(canvas.width / 11));
    var offset = Math.max(0, heartRates.length - max);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#00796B';
    if (mode === 'bar') {
      for (var i = 0; i < Math.max(heartRates.length, max); i++) {
        var barHeight = Math.round(heartRates[i + offset ] * canvas.height / 200);
        context.rect(11 * i + margin, canvas.height - barHeight, margin, Math.max(0, barHeight - margin));
        context.stroke();
      }
    } else if (mode === 'line') {
      context.beginPath();
      context.lineWidth = 6;
      context.lineJoin = 'round';
      context.shadowBlur = '1';
      context.shadowColor = '#333';
      context.shadowOffsetY = '1';
      for (var i = 0; i < Math.max(heartRates.length, max); i++) {
        var lineHeight = Math.round(heartRates[i + offset ] * canvas.height / 200);
        if (i === 0) {
          context.moveTo(11 * i, canvas.height - lineHeight);
        } else {
          context.lineTo(11 * i, canvas.height - lineHeight);
        }
        context.stroke();
      }
    }
  });
}

window.onresize = drawWaves;

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    drawWaves();
  }
});
