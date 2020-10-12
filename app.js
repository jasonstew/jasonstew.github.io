<<<<<<< Updated upstream
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
=======
var canvas = document.querySelector('canvas');
var statusText = document.querySelector('#statusText');
var myTab = document.getElementById("myTab");
var dataContainer = document.getElementById("dataContainer");
var variableNames = ["Pressure 1", "Pressure 2", "Pressure 3", "Pressure 4", "Pressure 5", "PID 1", "PID 2", "PID 3", "Flow 1", "Flow 2", "Temperature", "Humidity"]
statusText.addEventListener('click', function() {
  statusText.textContent = 'connecting...';
  heartRates = [];
  options = [];

  heartRateSensor.connect()
    .then(() => addList());
  //.then(() =>  heartRateSensor.startNotificationsHeartRateMeasurement());
  //  .then(() => handleHeartRateMeasurement);

  //.then(() => heartRateSensor.startNotificationsHeartRateMeasurement().then(handleHeartRateMeasurement))
  //  .catch(error => {
  //  statusText.textContent = error;
  //});
  //  dropdown.style.visibility = "visibile";



});

async function initializePlots(heartRateMeasurement) {

  var time = new Date();
  var i;
  for (i = 0; i < heartRateMeasurement.SensorVal.length; i++) {
    if (typeof heartRateMeasurement.SensorVal[i] !== 'undefined') {

      var cardString = variableNames[i] + "dataCard";
      var divString = variableNames[i] + "myDiv";

      var cardElement = document.getElementById(cardString);
      var divElement = document.getElementById(divString);
      var olderTime = time.setMinutes(time.getMinutes() - 1);
      var futureTime = time.setMinutes(time.getMinutes() + 1);


      if (cardElement == null) {

        var minuteView = {
          xaxis: {
            type: 'date',
            range: [olderTime, futureTime]
          }
        };
        var data = {
          x: [time],
          y: [heartRateMeasurement.SensorVal[i]],
          mode: 'lines',
          line: {
            color: '#80CAF6'
          }
        };
        var dataCard = [{
          domain: {
            x: [0, 1],
            y: [0, 1]
          },
          value: 450,
          title: {
            text:  variableNames[i]
          },
          type: "indicator",
          mode: "gauge+number",
          delta: {
            reference: 400
          },
          gauge: {
            axis: {
              range: [null, 100]
            }
          }
        }];
        var layout = {
          width: 600,
          height: 400
        };
        var config = {
          responsive: true
        }
        var para1 = document.createElement("div");
        para1.id = cardString;
        dataContainer.appendChild(para1);
        var para2 = document.createElement("div");
        para2.id = divString;
        dataContainer.appendChild(para2);
        //  dataContainer.innerHTML += `<div id="${cardString}"></div>
        //<div id="${divString}"></div>`
        Plotly.plot(cardString, dataCard, config)
          .then(Plotly.plot(divString, [data],  config).then(function() {
            window.requestAnimationFrame(function() {
              window.requestAnimationFrame(function() {
            //    window.alert('Your plot is done.');
              });
            });
          }));
      }
    }
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(heartRateMeasurement);
    }, 3 * 1000);
  });
}
// sensorselect.addEventListener('click', function() {
// heartRates = [];
//   options =[];
// var j;
//  for ( j=1; j< heartRateSensor.options.length; j++)
//  {
//    heartRateSensor.stopNotificationsHeartRateMeasurement(j);
//     }
//         var time = new Date();
//     var data = [{
//       x: [time],
//       y: [0],
//       mode: 'lines',
//       line: {color: '#80CAF6'}
//     }]
//
//     var dataCard = [
//       {
//         domain: { x: [0, 1], y: [0, 1] },
//         value: 0,
//         title: { text: "Humidity" },
//         type: "indicator",
//         mode: "number",
//       }
//     ];
//
//     var layout = { width: 600, height: 400 };
//     var config = {responsive: true}
//     Plotly.newPlot('dataCard', dataCard, layout,config);
//
//     Plotly.newPlot('myDiv', data,config);
//  heartRateSensor.startNotificationsHeartRateMeasurement(1).then(handleHeartRateMeasurement);
// //  .catch(error => {
//   //  statusText.textContent = error;
//   //});
//
// });
// function plotData(heartRateMeasurement){
//
//
//
//   var data = [{
//     x: [time],
//     y: [heartRateMeasurement],
//     mode: 'lines',
//     line: {color: '#80CAF6'}
//   }]
//
//   Plotly.newPlot('myDiv', data);
//
//   var cnt = 0;
//
//   var interval = setInterval(function() {
//
//     var time = new Date();
//
//
//     Plotly.relayout('myDiv', minuteView);
//     Plotly.extendTraces('myDiv', update, [0])
//
//     if(++cnt === 100) clearInterval(interval);
//   }, 1000);
// }
function addList() {
  var i;

  $('#button_container').hide();


  //var option = document.createElement("option");
  //option.text=heartRateSensor.options[i].uuid;
  //   sensorselect.append('<a class="dropdown-item" href="#"> "$heartRateSensor.options[i].uuid" </a>');

  //  sensorselect.innerHTML += `<a class="dropdown-item" href="#">${heartRateSensor.options[i].uuid}</a>`;


  // statusText.textContent = 'Select Sensor...';
  heartRateSensor.startNotificationsHeartRateMeasurement().then(handleHeartRateMeasurement);

  //handleHeartRateMeasurement();
}

function handleHeartRateMeasurement(heartRateMeasurement) {
  const once = {
    once: true
  };
  heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
    var heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value);
    initializePlots(heartRateMeasurement)
      .then(heartRateMeasurement => plotData(heartRateMeasurement));
  });
  //const promise2= promise.then(()=>plotData));
  //heartRateMeasurement.addEventListener('characteristicvaluechanged', event =>plotData);


}

function plotData(heartRateMeasurement) {

  //  var heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value);
  var time = new Date();
  var i;
  for (i = 0; i < heartRateMeasurement.SensorVal.length; i++) {
    if (typeof heartRateMeasurement.SensorVal[i] !== 'undefined') {

      var cardString = variableNames[i] + "dataCard";
      var divString = variableNames[i] + "myDiv";

      var cardElement = document.getElementById(cardString);
      var divElement = document.getElementById(divString);
      var olderTime = time.setMinutes(time.getMinutes() - 1);
      var futureTime = time.setMinutes(time.getMinutes() + 1);

      var minuteView = {
        xaxis: {
          type: 'date',
          range: [olderTime, futureTime]
        }
      };


      if (cardElement !== null) {
        var data = {
          x: [
            [time]
          ],
          y: [
            [heartRateMeasurement.SensorVal[i]]
          ]
        }
        var dataCard = {
          value: heartRateMeasurement.SensorVal[i]
        };

        Plotly.relayout(divString, minuteView);
        Plotly.extendTraces(divString, data, [0]);
        Plotly.restyle(cardString, dataCard);

      }

      //    statusText.innerHTML = heartRateMeasurement;
      //  heartRates.push(heartRateMeasurement);
      //  drawWaves();
    }
  }

}

//canvas.addEventListener('click', event => {
//  mode = mode === 'bar' ? 'line' : 'bar';
//  drawWaves();
//});
>>>>>>> Stashed changes
