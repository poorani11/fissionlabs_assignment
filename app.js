// MODULE
var chartsDisplayApp = angular.module('chartsDisplayApp', ['ngRoute']);

// ROUTES
chartsDisplayApp.config(function ($routeProvider){

  $routeProvider

  .when('/', {
    templateUrl: 'pages/home.html',
    controller: 'homeController'
  })
  .when('/displayCsv', {
    templateUrl: 'pages/display.html',
    controller: 'displayController'
  })
});

// SERVICES
chartsDisplayApp.service('displayService', function(){

  this.data = [];

});


// CONTROLLERS
chartsDisplayApp.controller('homeController', ['$scope','$location','displayService',  function($scope, $location,displayService){
  $scope.data = displayService.data;
  $scope.readCsv =  function() {
    var fileUpload = document.getElementById("txtFileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
      if (typeof (FileReader) != "undefined") {
        var reader = new FileReader();
        reader.onload = function (e) {
          $scope.data = e.target.result;
          displayService.data = $scope.data;
          $location.path( "/displayCsv" )
        }
      }
      reader.readAsText(fileUpload.files[0]);
    } else {
      alert("This browser does not support HTML5.");
    }
  };
}]);

chartsDisplayApp.controller('displayController', ['$scope','displayService', function($scope, displayService){
  $scope.data = displayService.data;
  var allTextLines = $scope.data.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var lines = [];

  for ( var i = 0; i < allTextLines.length; i++) {
    // split content based on comma
    var data = allTextLines[i].split(',');
    if (data.length == headers.length) {
      var tarr = [];
      for ( var j = 0; j < headers.length; j++) {
        tarr.push(data[j]);
      }
      lines.push(tarr);
    }
  }

  function getDataPointsFromCSV(csv) {
    var dataPoints =  [];

    for (var i = 1; i < csv.length; i++)
    if (csv[i].length > 0) {
      var points = csv[i].split("|");
      var date = points[0]+'.01'+'.01';
      var newDate = new Date(date).getTime() / 1000;
      dataPoints.push({
        x: parseFloat(points[0]),
        y: parseFloat(points[1])
      });
    }
    console.log(dataPoints);
    return dataPoints;
  }

  var chart = new CanvasJS.Chart("chartContainer", {
    title: {
      text: "Series Data"
    },
    axisX: {
      title: "year",
      valueFormatString:"####",
    },
    axisY2: {
      title: "score",
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      verticalAlign: "top",
      horizontalAlign: "center",
      dockInsidePlotArea: true,
      itemclick: toogleDataSeries
    },
    data: [{
      type:"line",
      xValueFormatString:"Year ####",
      axisYType: "secondary",
      name: lines[0][0],
      showInLegend: true,
      markerSize: 0,
      dataPoints:getDataPointsFromCSV(lines[0])
    },
    {
      type: "line",
      xValueFormatString:"Year ####",
      axisYType: "secondary",
      name: lines[1][0],
      showInLegend: true,
      markerSize: 0,
      dataPoints:getDataPointsFromCSV(lines[1])
    },
    {
      type: "line",
      xValueFormatString:"Year ####",
      axisYType: "secondary",
      name: lines[2][0],
      showInLegend: true,
      markerSize: 0,
      dataPoints:getDataPointsFromCSV(lines[2])
    },
    {
      type: "line",
      xValueFormatString:"Year ####",
      axisYType: "secondary",
      name: lines[3][0],
      showInLegend: true,
      markerSize: 0,
      dataPoints:getDataPointsFromCSV(lines[3])
    }]
  });
  chart.options.data[0].dataPoints.sort(compareDataPoints);
  chart.options.data[1].dataPoints.sort(compareDataPoints);
  chart.options.data[2].dataPoints.sort(compareDataPoints);
  chart.options.data[3].dataPoints.sort(compareDataPoints);

  chart.render();

  function toogleDataSeries(e){
    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else{
      e.dataSeries.visible = true;
    }
    chart.render();
  }

  function compareDataPoints(dataPoint1, dataPoint2){
    if (dataPoint1.x < dataPoint2.x){return -1}
    if ( dataPoint1.x > dataPoint2.x){return 1}
    return 0
  }


}]);
