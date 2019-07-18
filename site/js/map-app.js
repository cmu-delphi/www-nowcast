/*!
* ILY Nearby | Influenza-like Illness Nearby
* @authors:
    David Farrow, PhD | Computational Biology Department | Carnegie Mellon University
    Roberto Iriondo | Machine Learning Department, Carnegie Mellon University
    Bryan Learn | Pittsburgh Supercomputing Center | Computer Science Department, Carnegie Mellon University
    Delphi Research Group | Carnegie Mellon University
* @author-url: https://delphi.midas.cs.cmu.edu/
* @copyright: Delphi Research Group | Carnegie Mellon University | All Rights Reserved
* @description: Data visualization web application that uses machine learning, data analytics,
*               and crowd-sourcing methods to generate geographically detailed real-time
*               estimates (nowcasts) of influenza-like-illness in the United States.
* @acknowledgements:
*               Map application powered by Leaflet - a library for interactive maps.
*               https://leafletjs.com - (c) Vladimir Agafonkin | http://agafonkin.com/en
*
*               Data visualization powered by D3.JS - a library for data visualization in javascript.
*               https://d3js.org/ - (c) Mike Bostock | https://bost.ocks.org/mike/
*
*               Map custom tiles provided by Thundersforest API
*               Thunderforest is a project by Gravitystorm Limited | https://www.thunderforest.com/contact/
*
*               ILI Nearby uses jQuery, jQuery v3.1.1 | (c) jQuery Foundation | jquery.org/license
*
*               Icons use: Font Awesome 4.6.3 by @davegandy - http://fontawesome.io - @fontawesome
*               License - http://fontawesome.io/license (Font: SIL OFL 1.1, CSS: MIT License)
*/

//"use strict";

// States as ordered in us-states-up, as used by map
var STATESUP = ["AZ", "AR", "CA", "CO", "CT", "DC", "GA", "HI",
  "IL", "IN", "LA", "MN", "MS", "MT", "NM", "ND", "OK", "PA", "TN", "VA",
  "PR", "DE", "WV", "WI", "WY", "AL", "AK", "FL", "ID", "KS", "MD",
  "NJ", "NC", "SC", "WA", "VT", "UT", "IA", "KY", "ME", "MA",
  "MI", "MO", "NE", "NV", "NH", "NY", "OH", "OR", "RI", "SD", "TX"];

// HHS Regions
var HHS = ['hhs1', 'hhs2', 'hhs3', 'hhs4', 'hhs5',
  'hhs6', 'hhs7', 'hhs8', 'hhs9', 'hhs10'];
var CENSUSREGIONS = ['cen1', 'cen2', 'cen3', 'cen4', 'cen5',
  'cen6', 'cen7', 'cen8', 'cen9'];

function init() {
  // Fetch Epidata nowcast for States Layer
  let fetchStateData = () => {
      return new Promise((resolve, reject) => {
        Epidata.nowcast(function(result, message, epidata) {
          // Parse current week's data
          var currentWeek = epidata[epidata.length - 1].epiweek;
          var weekData = [], weekStateData = [];
          epidata.forEach(function(element) {
            if (element.epiweek === currentWeek) {
              weekData.push(element);
            }
          });
          // Store weekly state data (alphabetized by abbreviation)
          for (var i = 0; i < weekData.length; i++) {
            var state = {};
            state.name = weekData[i].location;
            state.value = weekData[i].value;
            weekStateData.push(state);
          }

          // Assign the proper epidata value to states
          // Array provides position of corresponding us-states-up state
          var assignValueArr = [26, 25, 1, 0, 2, 3, 4, 5, 21, 27, 6,
                                7, 37, 28, 8, 9, 29, 38, 10, 40, 30,
                                39, 41, 11, 42, 12, 13, 32, 15, 43,
                                45, 31, 14, 44, 46, 47, 16, 48, 17,
                                20, 49, 33, 50, 18, 51, 36, 19, 35,
                                34, 23, 22, 24];
          for (var i = 0; i < weekStateData.length; i++) {
            statesData.features[0].features[assignValueArr[i]].properties.value =
              weekStateData[i].value;
          }

          resolve(statesData);

        }, STATESUP, "201901-203052");
    });
  };

  let fetchNationalData = () => {
      return new Promise((resolve, reject) => {
        Epidata.nowcast(function(result, message, epidata) {
          // Parse current week's data
          var currentWeek = epidata[epidata.length - 1].epiweek;
          var weekData = [], weekStateData = [];
          epidata.forEach(function(element) {
            if (element.epiweek === currentWeek) {
              weekData.push(element);
            }
          });

          usData.features[0].properties.value = weekData[0].value;

          resolve(usData);

      }, "nat", "201901-203052");
    });
  };

  let fetchHHSData = () => {
    return new Promise((resolve, reject) => {
      Epidata.nowcast(function(result, message, epidata) {
        // Parse current week's data
        var currentWeek = epidata[epidata.length - 1].epiweek;
        var weekData = [], weekHHSData = [];
        epidata.forEach(function(element) {
          if (element.epiweek === currentWeek) {
            weekData.push(element);
          }
        });
        // Store weekly state data (alphabetized by abbreviation)
        for (var i = 0; i < weekData.length; i++) {
          var hhs = {};
          hhs.name = weekData[i].location;
          hhs.value = weekData[i].value;
          weekHHSData.push(hhs);
        }

        // Assign the proper epidata value to hhs
        // Array provides position of corresponding hhs data
        var assignValueArr = [0, 9, 1, 2, 3, 4, 5, 6, 7, 8];
        for (var i = 0; i < weekHHSData.length; i++) {
          hhsData.features[assignValueArr[i]].properties.value =
            weekHHSData[i].value;
        }

        resolve(hhsData);

      }, HHS, "201901-203052");
    });
  };

  let fetchCensusData = () => {
    return new Promise((resolve, reject) => {
      Epidata.nowcast(function(result, message, epidata) {
        // Parse current week's data
        var currentWeek = epidata[epidata.length - 1].epiweek;
        var weekData = [], weekCensusData = [];
        epidata.forEach(function(element) {
          if (element.epiweek === currentWeek) {
            weekData.push(element);
          }
        });

        // Store weekly state data (alphabetized by abbreviation)
        for (var i = 0; i < weekData.length; i++) {
          var region = {};
          region.name = weekData[i].location;
          region.value = weekData[i].value;
          weekCensusData.push(region);
        }

        // Assign the proper epidata value to censusData
        for (var i = 0; i < weekCensusData.length; i++) {
          censusData.features[i].properties.value = weekCensusData[i].value;
        }

        resolve(epidata);

      }, CENSUSREGIONS, "201901-203052");
    });
  };

  fetchStateData()
  .then(fetchNationalData)
  .then(fetchHHSData)
  .then(fetchCensusData)
  .then(initMap);

}

function initMap() {

    //var states = L.layerGroup([statesData]); //replace statesData with states
    //var cities = L.layerGroup([citiesData]); //replace citiesData with cities

    var map = L.map('map').setView([37.8, -96], 3);
    //Removed default zoom size 4

    /*Additions
  var map = L.map('map', {
    setView: ([37.8, -96],4),
    zoom: 15,
    layers: [statesData, cities]
  });

  // End Additions */
    L.tileLayer('https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=e1afe91e75634f3d9d1056b779bb9bf1',{
    // L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { //Default Tile Layer
        attribution: 'OSM',
        maxZoom: 11,
        minZoom: 3
    }).addTo(map);

    //d = value

    /*
    function getColor(d) {
        //TODO: Debug fillBg function
        return d > 1.3 ?
            "#800026" :
            d > 1.1 ?
            "#BD0026" :
            d > 0.9 ?
            "#E31A1C" :
            d > 0.7 ?
            "#FC4E2A" :
            d > 0.5 ?
            "#FD8D3C" :
            d > 0.3 ?
            "#FEB24C" :
            d > 0.1 ?
            "#FED976" :
            "#FFEDA0";
    }
    */

    function getColor(d) {
        //TODO: Debug fillBg function
        return d > 3 ?
            "#800026" :
            d > 2.5 ?
            "#BD0026" :
            d > 2 ?
            "#E31A1C" :
            d > 1.5 ?
            "#FC4E2A" :
            d > 1 ?
            "#FD8D3C" :
            d > 0.5 ?
            "#FEB24C" :
            d > 0.1 ?
            "#FED976" :
            "#FFEDA0";
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.value),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.8
        };
    }

    /* Add Zoom Interchangeable Layers */
    var ZoomShowHide = L.FeatureGroup.extend({
    initialize: function () {
        this.layers = []
        this._layerGroup = L.featureGroup();
    },

    onAdd: function (map) {
        this._layerGroup.addTo(map)
        var that = this; // I do not like this programing language.
        this.map = map
        this.map.on('zoom', function(e) {that.filter()});
    },

    filter: function () {
        var current_zoom_level = this.map.getZoom();
        for (var i=0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            if ((layer.min_zoom == null || current_zoom_level >= layer.min_zoom) &&
                (layer.max_zoom == null || current_zoom_level <= layer.max_zoom)){
                if (!this._layerGroup.hasLayer(layer)) {
                    layer.addTo(this._layerGroup);
                }
            } else {
                if (this._layerGroup.hasLayer(layer)) {
                    layer.removeFrom(this._layerGroup);
                }
            }
        }
    },

    addLayer: function (layer){
        this.layers.push(layer)
        this.filter()
    },

    addLayers: function (layers) {
        this.layers = this.layers.concat(layers)
        this.filter()
    },

    _removeLayer: function(layer) {
        if (this._layerGroup.hasLayer(layer)){
            layer.removeFrom(this._layerGroup);
        }
    },

    removeLayer: function(layer) {
        this._removeLayer(layer);
        this.layers = this.layers.filter(function(e) { return e !== layer });
        this.filter();
    },

    clearLayers: function() {
        for (var i=0; i < this.layers.length; i++) {
            var layer = this.layers[i];
            this._removeLayer(layer);
        }
        this.layers = [];
    }
    });
    /* /Add Zoom Interchangeable Layers */

    /*
    L.geoJson(statesData, citiesData, usData, hhsData, {
        style: style
    }).addTo(map);
    */

    //<script id="map-zoom-listener">
    // listen for screen resize events
    window.addEventListener('resize', function(event) {
        // get the width of the screen after the resize event
        var width = document.documentElement.clientWidth;
        // tablets are between 768 and 922 pixels wide
        // phones are less than 768 pixels wide
        if (width < 768) {
            // set the zoom level to 10
            map.setZoom(3);
        } else {
            // set the zoom level to 8
            map.setZoom(4);
        }
    });

    // ID = interaction
    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: .9
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        //info.update(layer.feature.properties);
    }

    //Reset highlights for US areas
    function resetHighlight(e) {
        // Resets style for hovered areas on the map
        usLayer.resetStyle(e.target);
        //info.update(); //Commented out info.update(); in order for hovering info to stay up while hovering over an area
    }

    function zoomToFeature(e) {
        var layer = e.target;
        map.fitBounds(layer.getBounds()); // zoom

        info.update(layer.feature.properties); // update name

        // render timeseries chart
        var regionID = lookupRegionID(layer.feature.properties.name)
        renderChart(regionID, global_epiweek);
        App.prototype.fetchNowcast(regionID, global_epiweek); //Show (ili + std %) on map and timeseries
    }

    //Maps region name to ID / abbrev.
    function lookupRegionID(regionName){
        for (var key in NAMES){
            if (regionName == NAMES[key]){
                return key
            }
        }
    }

    /*
    //Linking

    function metroLink(e) {
        //Console.log(e.target.feature.properties.name);
        var urlLink;
        switch (e.target.feature.properties.id) {
        case 'Pittsburgh':
            //id = 'AL';
            urlLink = 'http://pittsburghpa.gov/';
            break;
            //Test US National
        case 'US':
            //id = 'US';
            urlLink = 'https://www.whitehouse.gov';
            break;
        }
        window.open(urlLink, '_blank');
    }
    */

    // /Experimental Cities */

    //Add IDs to path //start
    //experimental
    var geoJsonLayer = L.geoJson(statesData, citiesData, usData).addTo(map);

    geoJsonLayer.eachLayer(function(layer) {
        //layer._path.id = 'feature-' + layer.feature.properties.id;
        layer._path.id = layer.feature.properties.id;
    });
    //end

    //Removed click feature, click to metroLink URL as we are adding <a class="details"></a> to show graph and details of area.
    /*
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: metroLink
        });
    }
    */

    //Zoom to feature for each area
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    var usLayer = L.geoJson(usData, {
        style: style,
        onEachFeature: onEachFeature
    });

    var hhsLayer = L.geoJson(hhsData,  {
        style: style,
        onEachFeature: onEachFeature
    });

    var censusLayer = L.geoJson(censusData,  {
        style: style,
        onEachFeature: onEachFeature
    });

    var citiesLayer = L.geoJSON(citiesData, {
  	pointToLayer: function (feature, latlng) {
  			return L.marker(latlng);
  	},
    style: style,
    onEachFeature: onEachFeature
    });//.addTo(map); removed automatic addition of cities until we get data.

    var countiesLayer = L.geoJson(countiesData, {
        style: style,
        onEachFeature: onEachFeature
    });

    var statesLayer = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    /*Zoom Layer Toggle Function*/

    /* //Temporarily remove zoom toogling

    map.on('zoomend', function() {
    if (map.getZoom() <= 8){
        if (map.hasLayer(citiesLayer)) {
            map.removeLayer(citiesLayer);
            map.removeLayer(countiesLayer);
        } else {
            console.log("States layer active.");
            map.addLayer(statesLayer);
            map.removeLayer(countiesLayer);
            map.removeLayer(citiesLayer);
        }
    }
    */

    /* //Temporarily remove countiesLayer automatic activation
    if (map.getZoom() >= 8){
        if (map.hasLayer(citiesLayer)) {
            //map.removeLayer(citiesLayer);
            map.removeLayer(statesLayer);
        } else {
            console.log("Counties layer active.");
            map.addLayer(countiesLayer);
            map.removeLayer(statesLayer);
        }
    }
    */

    /* //Temporarily remove citiesLayer automatic activation
    if (map.getZoom() >= 11){
        if (map.hasLayer(citiesLayer)) {
            console.log("Cities layer active.");
        } else {
            map.addLayer(citiesLayer);
            console.log("Cities layer active.");
            map.removeLayer(statesLayer);
            //map.removeLayer(countiesLayer);
        } if (map.getZoom() < 11) {
          //map.addLayer(countiesLayer);
        }
    }
    */
    /*
  }); */

    /* /Zoom Layer Toggle Function */

    var overlayMaps = {
        "National": usLayer,
        "HHS Regions": hhsLayer,
        "Census Regions": censusLayer,
        "States": statesLayer,
        //"Counties": countiesLayer,
        //"Cities": citiesLayer
    };
    L.control.layers(null, overlayMaps).addTo(map);

    //map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');

    //Info Controls
    var info = L.control();

    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info');
        // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    /*info.update = function (props) {
      this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
          '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
          : 'Hover over a state');
    };*/

    info.update = function(props) { //Debugging props.density, add ili value from application
        this._div.innerHTML = '<h4 id="info_control_title">Influenza-like Illness</h4>' + (props ? '<b>' + props.name + '</b>' +
        '<div id="nowcast_value_map"></div>' +
        // Added SVG Button for Details
        // Details button must contain q=? in order to show detailed info of area selected of the map.
        '<a title="Show details for the selected region." href="#api-details-data" class="details"><svg id="details-icon" aria-hidden="true" data-prefix="fas" data-icon="analytics" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-analytics fa-w-18 fa-fw fa-lg"><path fill="currentColor" d="M510.62 92.63C516.03 94.74 521.85 96 528 96c26.51 0 48-21.49 48-48S554.51 0 528 0s-48 21.49-48 48c0 2.43.37 4.76.71 7.09l-95.34 76.27c-5.4-2.11-11.23-3.37-17.38-3.37s-11.97 1.26-17.38 3.37L255.29 55.1c.35-2.33.71-4.67.71-7.1 0-26.51-21.49-48-48-48s-48 21.49-48 48c0 4.27.74 8.34 1.78 12.28l-101.5 101.5C56.34 160.74 52.27 160 48 160c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-4.27-.74-8.34-1.78-12.28l101.5-101.5C199.66 95.26 203.73 96 208 96c6.15 0 11.97-1.26 17.38-3.37l95.34 76.27c-.35 2.33-.71 4.67-.71 7.1 0 26.51 21.49 48 48 48s48-21.49 48-48c0-2.43-.37-4.76-.71-7.09l95.32-76.28zM400 320h-64c-8.84 0-16 7.16-16 16v160c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V336c0-8.84-7.16-16-16-16zm160-128h-64c-8.84 0-16 7.16-16 16v288c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V208c0-8.84-7.16-16-16-16zm-320 0h-64c-8.84 0-16 7.16-16 16v288c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V208c0-8.84-7.16-16-16-16zM80 352H16c-8.84 0-16 7.16-16 16v128c0 8.84 7.16 16 16 16h64c8.84 0 16-7.16 16-16V368c0-8.84-7.16-16-16-16z" class=""></path></svg></a>' : '<p id="info_control_tip">Click on an area<br/>around the map</p>');
    };

    info.addTo(map);

    //Legend Controls
    var legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function(map) {

        var div = L.DomUtil.create('div', 'info legend')
          , //grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        grades = [0.1, .5, 1, 1.5, 2, 2.5, 3, 3.5]
        //labels = []; //Commented out labels = []; on 10/23/18 - Restore if issues arise with map-app
        div.innerHTML += '<h5>Lowest</h5>';
        // loop through our density intervals and generate a label with a colored square for each interval
        /*for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }*/
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += '<i style="background:' + getColor(grades[i] + 0.1) + '"></i> ';
            //div.innerHTML += '<i style="background:' + App.prototype.fillBg(grades[i] + 0.1) + '"></i> ';
        }
        div.innerHTML += '<h5>Highest</h5>';

        return div;
    };

    legend.addTo(map);

}
document.addEventListener("DOMContentLoaded", function() {
    init();
});
