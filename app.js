var canvas = document.querySelector('canvas');
var statusText = document.querySelector('#statusText');
var sensorselect = document.getElementById("sensorselect");
statusText.addEventListener('click', function() {
  statusText.textContent = 'connecting...';
  heartRates = [];
  options =[];

  heartRateSensor.connect()
  .then(() => addList());
  //.then(() => plotData());

  //.then(() => heartRateSensor.startNotificationsHeartRateMeasurement().then(handleHeartRateMeasurement))
//  .catch(error => {
  //  statusText.textContent = error;
  //});
//  dropdown.style.visibility = "visibile";



});
sensorselect.addEventListener('click', function() {
heartRates = [];
  options =[];
var j;
 for ( j=1; j< heartRateSensor.options.length; j++)
 {
   heartRateSensor.stopNotificationsHeartRateMeasurement(j);
    }
        var time = new Date();
    var data = [{
      x: [time],
      y: [0],
      mode: 'lines',
      line: {color: '#80CAF6'}
    }]

    var dataCard = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: 0,
        title: { text: "Humidity" },
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 0 },
        gauge: { axis: { range: [null, 500] } }
      }
    ];

    var layout = { width: 600, height: 400 };
    Plotly.newPlot('dataCard', dataCard, layout);

    Plotly.newPlot('myDiv', data);
 heartRateSensor.startNotificationsHeartRateMeasurement(1).then(handleHeartRateMeasurement);
//  .catch(error => {
  //  statusText.textContent = error;
  //});

});
function plotData(heartRateMeasurement){




  var data = [{
    x: [time],
    y: [heartRateMeasurement],
    mode: 'lines',
    line: {color: '#80CAF6'}
  }]

  Plotly.newPlot('myDiv', data);

  var cnt = 0;

  var interval = setInterval(function() {

    var time = new Date();


    Plotly.relayout('myDiv', minuteView);
    Plotly.extendTraces('myDiv', update, [0])

    if(++cnt === 100) clearInterval(interval);
  }, 1000);
}
function addList(){
  var i;
  $('#connected_success').show();
  $('#dropdown').show();
    $('#button_container').hide();

  for( i=0; i< heartRateSensor.options.length; i++)
 {
   var option = document.createElement("option");
   //option.text=heartRateSensor.options[i].uuid;
//   sensorselect.append('<a class="dropdown-item" href="#"> "$heartRateSensor.options[i].uuid" </a>');

    sensorselect.innerHTML += `<a class="dropdown-item" href="#">${heartRateSensor.options[i].uuid}</a>`;

 }
 statusText.textContent = 'Select Sensor...';
}
function handleHeartRateMeasurement(heartRateMeasurement) {
  heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
    var heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value);
    var time = new Date();
    var update = {
    x:  [[time]],
    y: [[heartRateMeasurement]]
    }

    var olderTime = time.setMinutes(time.getMinutes() - 1);
    var futureTime = time.setMinutes(time.getMinutes() + 1);

    var minuteView = {
          xaxis: {
            type: 'date',
            range: [olderTime,futureTime]
          }
        };
        var dataCardUpdate = {
            value: heartRateMeasurement
        };
    Plotly.restyle('dataCard', dataCardUpdate);
    Plotly.relayout('myDiv', minuteView);
    Plotly.extendTraces('myDiv', update, [0])
//    statusText.innerHTML = heartRateMeasurement;
  //  heartRates.push(heartRateMeasurement);
  //  drawWaves();
  });
}

var heartRates = [];
var mode = 'line';

//canvas.addEventListener('click', event => {
//  mode = mode === 'bar' ? 'line' : 'bar';
//  drawWaves();
//});
