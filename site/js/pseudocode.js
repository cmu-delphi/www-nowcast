/*
* ILY Nearby | Influenza-like Illness Nearby
* @authors:
    David Farrow, PhD | Computational Biology Department | Carnegie Mellon University
    Roberto Iriondo | Machine Learning Department, Carnegie Mellon University
    Bryan Learn | Pittsburgh Supercomputing Center | Computer Science Department, Carnegie Mellon University
    Delphi Research Group | Carnegie Mellon University
    * @description: Data visualization web application that uses machine learning, data analytics,
    *               and crowd-sourcing methods to generate geographically detailed real-time
    *               estimates (nowcasts) of influenza-like-illness in the United States.
*/

//Populate parameters in URL for navigation
// Experimental - Start

var createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function.");
  }
}

var DBHelper = (function() {
  function DBHelper() {
    classCallCheck(this, DBHelper);
  }

  DBHelper.fetchLocations = function fetchLocations(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", DBHelper.DATABASE_URL);
    xhr.onload = function() {
      if (xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        var locations = json.locations;
        callback(null, locations);
      } else {
        var error = "Request failed. Returned status of " + xhr.status;
        callback(error, null);
      }
    };
    xhr.send();
  };

  DBHelper.fetchLocationById = function fetchLocationById(id, callback) {
    DBHelper.fetchLocations(function(error, locations) {
      if (error) {
        callback(error, null);
      } else {
        var location = locations.find(function(r) {
          return r.id == id;
        });
        if (location) {
          callback(null, location);
        } else {
          callback("Location does not exist", null);
        }
      }
    });
  };

  DBHelper.urlForLocation = function urlForLocation(location) {
    return "./index.html?id=" + location.id + "#api-details-data";
  };

  createClass(DBHelper, null, [
    {
      key: "DATABASE_URL",
      get: function get() {
        var port = 8000;
        return "js/geodata/us-national.js";
      }
    }
  ]);

  return DBHelper;
})();

//

document.addEventListener("DOMContentLoaded", function(event) {

var location = void 0;

fetchLocationFromURL = function fetchLocationFromURL(callback) {
  if (self.location) {
    callback(null, self.location);
    return;
  }
  var id = getParameterByName("id");
  if (!id) {
    error = "No location id in URL";
    callback(error, null);
  } else {
    DBHelper.fetchLocationById(id, function(error, location) {
      self.location = location;
      if (!location) {
        console.error(error);
        return;
      }
      fillLocationHTML();
      callback(null, location);
    });
  }
};
fillLocationHTML = function fillLocationHTML() {
  var location =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : self.location;

  var name = document.getElementById("location_name");
  name.innerHTML = location.name;
  var address = document.getElementById("nowcast_label");
  address.innerHTML = location.address;
  var image = document.getElementById("nowcast_value");
  //image.className = "location_img";
  //image.src = DBHelper.imageUrlForLocation(location);
  //var population = document.getElementById("location-population");
  //population.innerHTML = location.population_type;
};

getParameterByName = function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};
});

// Experimental - End
