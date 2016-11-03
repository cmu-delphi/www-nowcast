// Generated by CoffeeScript 1.11.1
var App, CENSUS_REGIONS, Epidata_fluview_single, Epidata_nowcast_multi, Epidata_nowcast_single, HHS_REGIONS, ILI_AVAILABLE, ILI_SHARED, LAT_MAX, LAT_MIN, LOCATIONS, LON_MAX, LON_MIN, MONTHS, NAMES, NATIONAL, PointerInput, REGION2STATE, REGIONS, STATES, WEEKDAYS, centerX, centerY, deg2rad, dlat, dlon, getEpidataHander, getFakeRow, get_ecef2ortho, i, indexes, j, l, lat, len, len1, len2, len3, len4, len5, len6, ll2ecef, lon, m, maxX, maxY, minX, minY, n, o, p, poly, q, r, ref, ref1, ref10, ref11, ref12, ref13, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, x1, x2, y1, y2,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

deg2rad = Math.PI / 180;

ll2ecef = function(lat, lon, h) {
  var C, H, S, a, clat, clon, f, ref, ref1, ref2, ref3, slat, slon, x, y, z;
  if (h == null) {
    h = 0;
  }
  ref = [lat * deg2rad, lon * deg2rad], lat = ref[0], lon = ref[1];
  ref1 = [Math.cos(lat), Math.cos(lon)], clat = ref1[0], clon = ref1[1];
  ref2 = [Math.sin(lat), Math.sin(lon)], slat = ref2[0], slon = ref2[1];
  ref3 = [6378137, Math.pow(298.257223563, -1)], a = ref3[0], f = ref3[1];
  C = Math.pow(Math.pow(clat, 2) + Math.pow((1 - f) * slat, 2), -0.5);
  S = Math.pow(1 - f, 2) * C;
  H = h / a;
  x = (C + H) * clat * clon;
  y = (C + H) * clat * slon;
  z = (S + H) * slat;
  return [x, y, z];
};

get_ecef2ortho = function(lat, lon, zoom, w, h) {
  var a, b, cx, cy, d, dx, dy, e, f, h2, ref, ref1, ref2, ref3, ref4, sx, sy, w2, wh;
  ref = [lat * deg2rad, lon * deg2rad], dx = ref[0], dy = ref[1];
  ref1 = [Math.sin(dx), Math.cos(dx)], sx = ref1[0], cx = ref1[1];
  ref2 = [Math.sin(dy), Math.cos(dy)], sy = ref2[0], cy = ref2[1];
  ref3 = [w / 2, h / 2], w2 = ref3[0], h2 = ref3[1];
  wh = Math.min(w2, h2) * zoom;
  ref4 = [-sy * wh, cy * wh, cy * sx * wh, sx * sy * wh, -cx * wh], a = ref4[0], b = ref4[1], d = ref4[2], e = ref4[3], f = ref4[4];
  return function(x, y, z) {
    return [w2 + x * a + y * b, h2 + x * d + y * e + z * f];
  };
};

indexes = [];

ref = geodata.locations['HI'].paths;
for (j = 0, len = ref.length; j < len; j++) {
  poly = ref[j];
  for (l = 0, len1 = poly.length; l < len1; l++) {
    i = poly[l];
    if (indexOf.call(indexes, i) < 0) {
      indexes.push(i);
    }
  }
}

for (m = 0, len2 = indexes.length; m < len2; m++) {
  i = indexes[m];
  ref1 = geodata.points[i], lat = ref1[0], lon = ref1[1];
  geodata.points[i] = [lat + 5, lon + 50];
}

indexes = [];

ref2 = geodata.locations['AK'].paths;
for (n = 0, len3 = ref2.length; n < len3; n++) {
  poly = ref2[n];
  for (o = 0, len4 = poly.length; o < len4; o++) {
    i = poly[o];
    if (indexOf.call(indexes, i) < 0) {
      indexes.push(i);
    }
  }
}

ref3 = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MIN_VALUE, Number.MIN_VALUE], minX = ref3[0], minY = ref3[1], maxX = ref3[2], maxY = ref3[3];

for (p = 0, len5 = indexes.length; p < len5; p++) {
  i = indexes[p];
  ref4 = geodata.points[i], lat = ref4[0], lon = ref4[1];
  if (lon < 0) {
    ref5 = [Math.min(minX, lon), Math.min(minY, lat), Math.max(maxX, lon), Math.max(maxY, lat)], minX = ref5[0], minY = ref5[1], maxX = ref5[2], maxY = ref5[3];
  }
}

ref6 = [(minX + maxX) / 2, (minY + maxY) / 2], centerX = ref6[0], centerY = ref6[1];

for (q = 0, len6 = indexes.length; q < len6; q++) {
  i = indexes[q];
  ref7 = geodata.points[i], lat = ref7[0], lon = ref7[1];
  if (lon > 0) {
    lon = lon - 360;
  }
  dlon = Math.abs(lon - centerX) * 12 / 17;
  dlat = Math.abs(lat - centerY) * 9 / 17;
  if (lat > centerY) {
    lat = lat - dlat;
  } else {
    lat = lat + dlat;
  }
  if (lon > centerX) {
    lon = lon - dlon;
  } else {
    lon = lon + dlon;
  }
  if (lon < -180) {
    lon = lon + 360;
  }
  geodata.points[i] = [lat - 35, lon - 10];
}

for (i = r = 0, ref8 = geodata.points.length; 0 <= ref8 ? r < ref8 : r > ref8; i = 0 <= ref8 ? ++r : --r) {
  ref9 = geodata.points[i], lat = ref9[0], lon = ref9[1];
  geodata.points[i] = ll2ecef(lat, lon);
  if (lon >= 0) {
    lon -= 360;
  }
  if (i === 0) {
    ref10 = [lon, lon, lat, lat], x1 = ref10[0], x2 = ref10[1], y1 = ref10[2], y2 = ref10[3];
  }
  ref11 = [Math.min(y1, lat), Math.max(y2, lat)], y1 = ref11[0], y2 = ref11[1];
  ref12 = [Math.min(x1, lon), Math.max(x2, lon)], x1 = ref12[0], x2 = ref12[1];
}

ref13 = [x1, x2, y1, y2], LON_MIN = ref13[0], LON_MAX = ref13[1], LAT_MIN = ref13[2], LAT_MAX = ref13[3];

WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

NATIONAL = ['nat'];

HHS_REGIONS = ['hhs1', 'hhs2', 'hhs3', 'hhs4', 'hhs5', 'hhs6', 'hhs7', 'hhs8', 'hhs9', 'hhs10'];

CENSUS_REGIONS = ['cen1', 'cen2', 'cen3', 'cen4', 'cen5', 'cen6', 'cen7', 'cen8', 'cen9'];

REGIONS = HHS_REGIONS.concat(CENSUS_REGIONS);

STATES = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

LOCATIONS = NATIONAL.concat(REGIONS).concat(STATES);

ILI_SHARED = ['AK', 'AZ', 'CA', 'CO', 'ID', 'KS', 'LA', 'MD', 'ME', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'OH', 'OR', 'PA', 'RI', 'TN', 'TX', 'VA', 'VI', 'VT', 'WI', 'WV', 'WY'];

ILI_AVAILABLE = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'IA', 'ID', 'IL', 'IN', 'KS', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'RI', 'SC', 'SD', 'TN', 'TX', 'VT', 'WI', 'WV', 'WY'];

NAMES = {
  "FL": "Florida",
  "cen4": "West North Central",
  "hhs9": "HHS Region 9",
  "MT": "Montana",
  "WV": "West Virginia",
  "RI": "Rhode Island",
  "AR": "Arkansas",
  "VA": "Virginia",
  "cen7": "West South Central",
  "IN": "Indiana",
  "NC": "North Carolina",
  "IA": "Iowa",
  "MN": "Minnesota",
  "cen2": "Middle Atlantic",
  "DE": "Delaware",
  "PA": "Pennsylvania",
  "hhs7": "HHS Region 7",
  "nat": "US National",
  "hhs10": "HHS Region 10",
  "LA": "Louisiana",
  "MD": "Maryland",
  "AK": "Alaska",
  "CO": "Colorado",
  "WI": "Wisconsin",
  "ID": "Idaho",
  "OK": "Oklahoma",
  "hhs3": "HHS Region 3",
  "hhs2": "HHS Region 2",
  "hhs1": "HHS Region 1",
  "cen1": "New England",
  "KY": "Kentucky",
  "ME": "Maine",
  "CA": "California",
  "cen5": "South Atlantic",
  "WY": "Wyoming",
  "ND": "North Dakota",
  "NY": "New York",
  "MA": "Massachusetts",
  "UT": "Utah",
  "DC": "District of Columbia",
  "MS": "Mississippi",
  "hhs6": "HHS Region 6",
  "GA": "Georgia",
  "AL": "Alabama",
  "HI": "Hawaii",
  "hhs4": "HHS Region 4",
  "AZ": "Arizona",
  "CT": "Connecticut",
  "KS": "Kansas",
  "NH": "New Hampshire",
  "cen8": "Mountain",
  "TX": "Texas",
  "NV": "Nevada",
  "TN": "Tennessee",
  "NJ": "New Jersey",
  "MI": "Michigan",
  "hhs8": "HHS Region 8",
  "NM": "New Mexico",
  "IL": "Illinois",
  "cen3": "East North Central",
  "VT": "Vermont",
  "WA": "Washington",
  "SD": "South Dakota",
  "NE": "Nebraska",
  "hhs5": "HHS Region 5",
  "SC": "South Carolina",
  "cen6": "East South Central",
  "OR": "Oregon",
  "cen9": "Pacific",
  "MO": "Missouri",
  "OH": "Ohio"
};

REGION2STATE = {
  "hhs1": ['ME', 'MA', 'NH', 'VT', 'RI', 'CT'],
  "hhs2": ['NY', 'NJ'],
  "hhs3": ['PA', 'DE', 'DC', 'MD', 'VA', 'WV'],
  "hhs4": ['NC', 'SC', 'GA', 'FL', 'KY', 'TN', 'MS', 'AL'],
  "hhs5": ['MI', 'IL', 'IN', 'OH', 'WI', 'MN'],
  "hhs6": ['LA', 'AR', 'OK', 'TX', 'NM'],
  "hhs7": ['IA', 'MO', 'NE', 'KS'],
  "hhs8": ['ND', 'SD', 'CO', 'WY', 'MT', 'UT'],
  "hhs9": ['NV', 'CA', 'HI', 'AZ'],
  "hhs10": ['WA', 'OR', 'AK', 'ID'],
  "cen1": ['ME', 'MA', 'NH', 'VT', 'RI', 'CT'],
  "cen2": ['PA', 'NY', 'NJ'],
  "cen3": ['WI', 'MI', 'IN', 'IL', 'OH'],
  "cen4": ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO'],
  "cen5": ['DE', 'MD', 'DC', 'WV', 'VA', 'NC', 'SC', 'GA', 'FL'],
  "cen6": ['KY', 'TN', 'MS', 'AL'],
  "cen7": ['OK', 'AR', 'LA', 'TX'],
  "cen8": ['MT', 'ID', 'WY', 'CO', 'UT', 'NV', 'AZ', 'NM'],
  "cen9": ['WA', 'OR', 'CA', 'AK', 'HI']
};

Date.prototype.getWeek = function() {
  var rst, stdDate;
  stdDate = new Date(2016, 0, 3);
  rst = Math.ceil((((this - stdDate) / 86400000) + stdDate.getDay() + 1) / 7) % 52;
  if (rst === 0) {
    return 52;
  }
  return rst;
};

getFakeRow = function(location, i) {
  return {
    'location': location,
    'epiweek': 201201 + 100 * Math.floor(i / 52) + i % 52,
    'value': 1 + Math.random() * 3,
    'std': 0.5 + Math.random() * 1,
    'wili': 1 + Math.random() * 3
  };
};

getEpidataHander = function(callback) {
  return function(result, message, epidata) {
    var msg;
    if (result === 1) {
      return callback(epidata);
    } else {
      msg = "The Epidata API says '" + message + "'. (error #" + result + ")";
      console.log(msg);
      return alert(msg);
    }
  };
};

Epidata_fluview_single = function(handler, location, epiweeks) {
  var callback, delay, fakeData;
  if ((typeof Epidata !== "undefined" && Epidata !== null ? Epidata.fluview : void 0) != null) {
    return Epidata.fluview(handler, location, epiweeks);
  } else {
    fakeData = (function() {
      var results, s;
      results = [];
      for (i = s = 0; s < 280; i = ++s) {
        results.push(getFakeRow(location, i));
      }
      return results;
    })();
    callback = function() {
      return handler(1, 'debug', fakeData);
    };
    delay = 250 + Math.round(Math.random() * 500);
    return window.setTimeout(callback, delay);
  }
};

Epidata_nowcast_single = function(handler, location) {
  var callback, delay, fakeData;
  if ((typeof Epidata !== "undefined" && Epidata !== null ? Epidata.nowcast : void 0) != null) {
    return Epidata.nowcast(handler, location, '201130-202030');
  } else {
    fakeData = (function() {
      var results, s;
      results = [];
      for (i = s = 0; s < 280; i = ++s) {
        results.push(getFakeRow(location, i));
      }
      return results;
    })();
    callback = function() {
      return handler(1, 'debug', fakeData);
    };
    delay = 250 + Math.round(Math.random() * 500);
    return window.setTimeout(callback, delay);
  }
};

Epidata_nowcast_multi = function(handler, locations, epiweek1, epiweek2) {
  var callback, delay, fakeData, len7, loc, row, s, t;
  if ((typeof Epidata !== "undefined" && Epidata !== null ? Epidata.nowcast : void 0) != null) {
    return Epidata.nowcast(handler, locations, Epidata.range(epiweek1, epiweek2));
  } else {
    fakeData = [];
    for (i = s = 0; s < 3; i = ++s) {
      for (t = 0, len7 = locations.length; t < len7; t++) {
        loc = locations[t];
        row = getFakeRow(loc, i);
        if (i === 0) {
          row.epiweek = epiweek2;
        }
        fakeData.push(row);
      }
    }
    callback = function() {
      return handler(1, 'debug', fakeData);
    };
    delay = 250 + Math.round(Math.random() * 500);
    return window.setTimeout(callback, delay);
  }
};

PointerInput = (function() {
  var THRESHOLD;

  THRESHOLD = 5;

  function PointerInput(elem, listener) {
    this.elem = elem;
    this.listener = listener;
    this.elem.on('mousedown touchstart', (function(_this) {
      return function(e) {
        return _this.onDown(e);
      };
    })(this));
    this.elem.on('mouseup touchend', (function(_this) {
      return function(e) {
        return _this.onUp(e);
      };
    })(this));
    this.elem.on('mousemove touchmove', (function(_this) {
      return function(e) {
        return _this.onMove(e);
      };
    })(this));
    this.elem.on('mouseleave touchleave', (function(_this) {
      return function(e) {
        return _this.onLeave(e);
      };
    })(this));
    this.elem.on('wheel', (function(_this) {
      return function(e) {
        return _this.onWheel(e);
      };
    })(this));
  }

  PointerInput.prototype._get_xyt = function(e) {
    var offset, ref14, touch;
    if (((ref14 = e.touches) != null ? ref14.length : void 0) > 0) {
      touch = e.touches.item(0);
      offset = this.elem.offset();
      return [touch.pageX - offset.left, touch.pageY - offset.top, +new Date()];
    } else {
      return [e.offsetX, e.offsetY, +new Date()];
    }
  };

  PointerInput.prototype.onDown = function(e) {
    return this.last = this.down = this._get_xyt(e);
  };

  PointerInput.prototype.onUp = function(e) {
    var ref14, ref15, t1, t2;
    if (this.down == null) {
      return;
    }
    ref14 = this.down, x1 = ref14[0], y1 = ref14[1], t1 = ref14[2];
    ref15 = this._get_xyt(e), x2 = ref15[0], y2 = ref15[1], t2 = ref15[2];
    this.down = null;
    if (Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 0.5) < THRESHOLD) {
      return this.listener.onClick((x1 + x2) / 2, (y1 + y2) / 2);
    }
  };

  PointerInput.prototype.onMove = function(e) {
    var ref14, ref15, t1, t2;
    if (this.down == null) {
      return;
    }
    e.preventDefault();
    this.curr = this._get_xyt(e);
    ref14 = this.last, x1 = ref14[0], y1 = ref14[1], t1 = ref14[2];
    ref15 = this.curr, x2 = ref15[0], y2 = ref15[1], t2 = ref15[2];
    this.last = this.curr;
    return this.listener.onDrag(x2, y2, x2 - x1, y2 - y1);
  };

  PointerInput.prototype.onLeave = function(e) {
    return this.down = null;
  };

  PointerInput.prototype.onWheel = function(e) {
    return this.listener.onScroll(e.originalEvent.deltaY);
  };

  return PointerInput;

})();

window.App = App = (function() {
  var PAGE_CHART, PAGE_MAP;

  PAGE_MAP = 0;

  PAGE_CHART = 1;

  function App() {
    var clicker, isPinching, pinchZoom, pinchend, pinchstart, ref14, x0, x3, y0, y3;
    clicker = (function(_this) {
      return function(name, locations) {
        return function() {
          $('.button_group0 i').removeClass('fa-dot-circle-o');
          $('.button_group0 i').addClass('fa-circle-o');
          $("#button_view_" + name + " i").removeClass('fa-circle-o');
          $("#button_view_" + name + " i").addClass('fa-dot-circle-o');
          return _this.setLocations(locations);
        };
      };
    })(this);
    ref14 = [-1, -1, -1, -1, -1, -1, -1, -1], x0 = ref14[0], x1 = ref14[1], x2 = ref14[2], x3 = ref14[3], y0 = ref14[4], y1 = ref14[5], y2 = ref14[6], y3 = ref14[7];
    isPinching = false;
    pinchZoom = (function(_this) {
      return function() {
        var d1, d2;
        d1 = Math.sqrt((x0 - x1) ^ 2 + (y0 - y1) ^ 2);
        d2 = Math.sqrt((x2 - x3) ^ 2 + (y2 - y3) ^ 2);
        alert(x2 + "|" + x3);
        alert(d1 + "|" + d2);
        if (d1 > d2) {
          return _this.zoomIn();
        } else {
          return _this.zoomOut();
        }
      };
    })(this);
    pinchend = (function(_this) {
      return function(e) {
        if (isPinching) {
          if (e.originalEvent.changedTouches.length === 2) {
            x2 = e.originalEvent.changedTouches[0].pageX;
            x3 = e.originalEvent.changedTouches[1].pageX;
            y2 = e.originalEvent.changedTouches[0].pageY;
            y3 = e.originalEvent.changedTouches[1].pageY;
            isPinching = false;
            alert("2:" + x2 + "|" + x3);
            return pinchZoom();
          } else if (e.originalEvent.changedTouches.length === 1) {
            if (x2 === -1) {
              x2 = e.originalEvent.changedTouches[0].pageX;
              return y2 = e.originalEvent.changedTouches[0].pageY;
            } else {
              x3 = e.originalEvent.changedTouches[0].pageX;
              y3 = e.originalEvent.changedTouches[0].pageY;
              isPinching = false;
              alert("1:" + x2 + "|" + x3);
              return pinchZoom();
            }
          }
        }
      };
    })(this);
    pinchstart = (function(_this) {
      return function(e) {
        var ref15;
        if (e.originalEvent.targetTouches.length === 2) {
          isPinching = true;
          ref15 = [-1, -1, -1, -1, -1, -1, -1, -1], x0 = ref15[0], x1 = ref15[1], x2 = ref15[2], x3 = ref15[3], y0 = ref15[4], y1 = ref15[5], y2 = ref15[6], y3 = ref15[7];
          x0 = e.originalEvent.targetTouches[0].pageX;
          x1 = e.originalEvent.targetTouches[1].pageX;
          y0 = e.originalEvent.targetTouches[0].pageY;
          return y1 = e.originalEvent.targetTouches[1].pageY;
        }
      };
    })(this);
    $('#button_view_nat').click(clicker('nat', NATIONAL));
    $('#button_view_hhs').click(clicker('hhs', HHS_REGIONS));
    $('#button_view_cen').click(clicker('cen', CENSUS_REGIONS));
    $('#button_view_sta').click(clicker('sta', STATES));
    $('#button_zoom_in').click((function(_this) {
      return function() {
        return _this.zoomIn();
      };
    })(this));
    $('#button_zoom_out').click((function(_this) {
      return function() {
        return _this.zoomOut();
      };
    })(this));
    this.dataTimeline = $("#dataTimeline");
    this.canvasMap = $('#canvas_map');
    this.canvasMap.mousemove((function(_this) {
      return function(e) {
        var ctx, loc;
        loc = _this.hitTest(e.offsetX, e.offsetY);
        if ((loc != null) && loc !== 'AK' && loc !== 'HI') {
          $('#canvas_map').css('cursor', 'pointer');
          _this.renderMap();
          ctx = _this.canvasMap[0].getContext('2d');
          ctx.font = 12 + 'px sans-serif';
          ctx.fillStyle = '#eee';
          return ctx.fillText(loc, e.offsetX, e.offsetY);
        } else {
          $('#canvas_map').css('cursor', 'auto');
          return _this.renderMap();
        }
      };
    })(this));
    this.canvasMap.on('touchstart', pinchstart);
    this.canvasMap.on('touchend', pinchend);
    this.canvasChart = $('#canvas_chart');
    $(window).resize((function(_this) {
      return function() {
        return _this.resizeCanvas();
      };
    })(this));
    this.pointerInput = new PointerInput(this.canvasMap, this);
    this.canvasMap.focus();
    this.currentPage = PAGE_MAP;
    this.setLocations(STATES);
    this.resetView();
    this.resizeCanvas();
    this.loadEpidata();
    window.onpopstate = (function(_this) {
      return function(e) {
        return _this.backToHome();
      };
    })(this);
    $('#back_arrow').click(function(e) {
      return window.history.back();
    });
  }

  App.prototype.loadEpidata = function() {
    var callback, handler;
    callback = (function(_this) {
      return function(epidata) {
        var currentdate, epiweek1, epiweek2, handler, ind;
        epiweek1 = epidata[epidata.length - 4].epiweek;
        epiweek2 = epidata[epidata.length - 1].epiweek;
        currentdate = new Date();
        ind = 'PM';
        if (currentdate.getHours() < 12) {
          ind = 'AM';
        }
        _this.dataTimeline.html("As of " + WEEKDAYS[currentdate.getDay()] + ", " + MONTHS[currentdate.getMonth()] + " " + currentdate.getDate() + ", " + currentdate.getFullYear() + ", " + currentdate.getHours() + ":" + currentdate.getMinutes() + ind + " EDT (epi-week " + currentdate.getWeek() + ")");
        callback = function(epidata) {
          var c, ili, len7, row, s, v;
          _this.colors = {};
          for (s = 0, len7 = epidata.length; s < len7; s++) {
            row = epidata[s];
            if (row.epiweek === epiweek2) {
              ili = row.value;
              v = Math.max(0, Math.min(5, ili)) / 5;
              c = ('0' + Math.round(0x3f + v * 0xc0).toString(16)).slice(-2);
              _this.colors[row.location] = '#' + c + '4040';
            }
          }
          return _this.renderMap();
        };
        handler = getEpidataHander(callback);
        return Epidata_nowcast_multi(handler, LOCATIONS, epiweek1, epiweek2);
      };
    })(this);
    handler = getEpidataHander(callback);
    return Epidata_nowcast_single(handler, 'nat');
  };

  App.prototype.backToHome = function() {
    this.currentPage = PAGE_MAP;
    return $('.pages').animate({
      left: '0%'
    }, 125);
  };

  App.prototype.showLocationDetails = function(loc) {
    var ref14, ref15;
    this.currentPage = PAGE_CHART;
    history.pushState({}, '');
    $('#location_name').html(NAMES[loc]);
    $('.achievement_holder').hide();
    if (loc.length > 2) {
      $('#location_link').show();
    } else {
      if (ref14 = loc.toUpperCase(), indexOf.call(ILI_AVAILABLE, ref14) >= 0) {
        $('#location_star1').show();
      } else {
        $('#location_star0').show();
      }
      if (ref15 = loc.toUpperCase(), indexOf.call(ILI_SHARED, ref15) >= 0) {
        $('#location_heart1').show();
      } else {
        $('#location_heart0').show();
      }
      $('#location_google0').show();
      $('#location_twitter0').show();
      $('#location_wiki0').show();
      $('#location_cdc1').show();
    }
    $('.location_right').css('display', 'none');
    $('#loading_icon').css('display', 'flex');
    $('.pages').animate({
      left: '-100%'
    }, 125);
    return this.fetchNowcast(loc);
  };

  App.prototype.setLocations = function(locations1) {
    this.locations = locations1;
    this.renderMapList();
    return this.renderMap();
  };

  App.prototype.resizeCanvas = function() {
    this.canvasMap.attr('width', this.canvasMap.width() + 'px');
    this.canvasMap.attr('height', this.canvasMap.height() + 'px');
    this.canvasChart.attr('width', this.canvasChart.width() + 'px');
    this.canvasChart.attr('height', this.canvasChart.height() + 'px');
    this.renderMap();
    return this.renderChart();
  };

  App.prototype.resetView = function() {
    this.dlat = 51.7;
    this.dlon = -108.8;
    this.zoom = 2;
    return this.renderMap();
  };

  App.prototype.onClick = function(x, y) {
    var loc;
    loc = this.hitTest(x, y);
    if (loc != null) {
      return this.showLocationDetails(loc);
    }
  };

  App.prototype.onDrag = function(x, y, dx, dy) {
    this.dlon -= dx / (4 * this.zoom);
    this.dlat += dy / (4 * this.zoom);
    this.dlat = Math.max(Math.min(this.dlat, LAT_MAX), LAT_MIN);
    this.dlon = Math.max(Math.min(this.dlon, LON_MAX), LON_MIN);
    return this.renderMap();
  };

  App.prototype.onScroll = function(delta) {
    var factor;
    factor = 1 + Math.abs(delta) / 500;
    if (delta < 0) {
      return this.zoomIn(factor);
    } else {
      return this.zoomOut(factor);
    }
  };

  App.prototype.zoomIn = function(factor) {
    if (factor == null) {
      factor = 1.5;
    }
    this.zoom = Math.min(this.zoom * factor, 500);
    return this.renderMap();
  };

  App.prototype.zoomOut = function(factor) {
    if (factor == null) {
      factor = 1.5;
    }
    this.zoom = Math.max(this.zoom / factor, 1.25);
    return this.renderMap();
  };

  App.prototype.renderMapList = function() {
    var len7, len8, loc, ref14, ref15, results, s, saveThis, t;
    $('#map_list ul').empty();
    saveThis = this;
    ref14 = this.locations;
    for (s = 0, len7 = ref14.length; s < len7; s++) {
      loc = ref14[s];
      $('#map_list ul').append($('<li>').attr('class', 'map_list_element').attr('id', 'map_list_element_' + loc).append($('<a>').attr('href', '#').append(NAMES[loc])));
    }
    ref15 = this.locations;
    results = [];
    for (t = 0, len8 = ref15.length; t < len8; t++) {
      loc = ref15[t];
      results.push($('#map_list_element_' + loc).hover(function(ev) {
        return saveThis.renderMap(this.id.substring(17));
      }, function(ev) {
        return saveThis.renderMap();
      }));
    }
    return results;
  };

  App.prototype.renderMap = function(highlight) {
    var cX, cY, ctx, h, i1, idx, j1, k1, l1, len10, len11, len12, len13, len14, len15, len16, len17, len7, len8, len9, line, ln, loc, m1, n1, o1, p1, q1, ref14, ref15, ref16, ref17, ref18, ref19, ref20, ref21, ref22, ref23, ref24, ref25, ref26, ref27, ref28, ref29, ref30, ref31, s, t, w;
    if (highlight == null) {
      highlight = null;
    }
    ref14 = [this.canvasMap.width(), this.canvasMap.height()], w = ref14[0], h = ref14[1];
    ctx = this.canvasMap[0].getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    line = {
      0: function(x, y) {
        return ctx.moveTo(x, y);
      },
      1: function(x, y) {
        return ctx.lineTo(x, y);
      }
    };
    this.ecef2ortho = get_ecef2ortho(this.dlat, this.dlon, this.zoom, w, h);
    ref15 = this.locations;
    for (s = 0, len7 = ref15.length; s < len7; s++) {
      loc = ref15[s];
      if (loc !== highlight) {
        ref16 = geodata.locations[loc].paths;
        for (t = 0, len8 = ref16.length; t < len8; t++) {
          poly = ref16[t];
          ctx.beginPath();
          ln = 0;
          for (i1 = 0, len9 = poly.length; i1 < len9; i1++) {
            idx = poly[i1];
            line[ln].apply(line, this.ecef2ortho.apply(this, geodata.points[idx]));
            ln |= 1;
          }
          ctx.closePath();
          ctx.fillStyle = (ref17 = (ref18 = this.colors) != null ? ref18[loc] : void 0) != null ? ref17 : '#ccc';
          ctx.fill();
          ctx.stroke();
        }
      }
    }
    if (highlight != null) {
      ctx.font = 12 + 'px sans-serif';
      ctx.strokeStyle = '#eee';
      if (highlight in REGION2STATE) {
        ctx.lineWidth = 0.5;
        ref19 = REGION2STATE[highlight];
        for (j1 = 0, len10 = ref19.length; j1 < len10; j1++) {
          loc = ref19[j1];
          ref20 = geodata.locations[loc].paths;
          for (k1 = 0, len11 = ref20.length; k1 < len11; k1++) {
            poly = ref20[k1];
            ctx.beginPath();
            ln = 0;
            for (l1 = 0, len12 = poly.length; l1 < len12; l1++) {
              idx = poly[l1];
              line[ln].apply(line, this.ecef2ortho.apply(this, geodata.points[idx]));
              ln |= 1;
            }
            ctx.closePath();
            ctx.fillStyle = (ref21 = (ref22 = this.colors) != null ? ref22[loc] : void 0) != null ? ref21 : '#ccc';
            ctx.fill();
            ctx.stroke();
          }
        }
        ctx.lineWidth = 1.5;
        ref23 = geodata.locations[highlight].paths;
        for (m1 = 0, len13 = ref23.length; m1 < len13; m1++) {
          poly = ref23[m1];
          ctx.beginPath();
          ln = 0;
          for (n1 = 0, len14 = poly.length; n1 < len14; n1++) {
            idx = poly[n1];
            line[ln].apply(line, this.ecef2ortho.apply(this, geodata.points[idx]));
            ln |= 1;
          }
          ctx.closePath();
          ctx.stroke();
        }
        ref24 = REGION2STATE[highlight];
        for (o1 = 0, len15 = ref24.length; o1 < len15; o1++) {
          loc = ref24[o1];
          ctx.fillStyle = '#eee';
          ref25 = this.locCenterOnMap(loc), cX = ref25[0], cY = ref25[1];
          ctx.fillText(loc, cX, cY);
        }
      } else {
        ctx.lineWidth = 1.5;
        ref26 = geodata.locations[highlight].paths;
        for (p1 = 0, len16 = ref26.length; p1 < len16; p1++) {
          poly = ref26[p1];
          ctx.beginPath();
          ln = 0;
          for (q1 = 0, len17 = poly.length; q1 < len17; q1++) {
            idx = poly[q1];
            line[ln].apply(line, this.ecef2ortho.apply(this, geodata.points[idx]));
            ln |= 1;
          }
          ctx.closePath();
          ctx.fillStyle = (ref27 = (ref28 = this.colors) != null ? ref28[loc] : void 0) != null ? ref27 : '#ccc';
          ctx.fill();
          ctx.stroke();
        }
        ctx.fillStyle = '#eee';
        ref29 = this.locCenterOnMap(highlight), cX = ref29[0], cY = ref29[1];
        ctx.fillText(highlight, cX, cY);
      }
    }
    if (highlight !== 'AK') {
      ref30 = this.locCenterOnMap('AK'), cX = ref30[0], cY = ref30[1];
      ctx.font = 12 + 'px sans-serif';
      ctx.fillStyle = '#eee';
      ctx.fillText('AK', cX, cY);
    }
    if (highlight !== 'HI') {
      ref31 = this.locCenterOnMap('HI'), cX = ref31[0], cY = ref31[1];
      ctx.font = 12 + 'px sans-serif';
      ctx.fillStyle = '#eee';
      ctx.fillText('HI', cX, cY);
    }
    return 0;
  };

  App.prototype.renderChart = function() {
    var bounds, ctx, h, i1, i2x, iVals, ili, ili2y, iliVals, len7, len8, line, maxILI, name, numWeeks, padding, prefix, ref14, ref15, ref16, ref17, row, s, t, trace, w, wk, write, x, y, yr;
    if (this.chartData == null) {
      return;
    }
    ref14 = [this.canvasChart.width(), this.canvasChart.height()], w = ref14[0], h = ref14[1];
    ctx = this.canvasChart[0].getContext('2d');
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.005 * (w + h) / 2;
    line = {
      0: function(x, y) {
        return ctx.moveTo(x, y);
      },
      1: function(x, y) {
        return ctx.lineTo(x, y);
      }
    };
    padding = {
      left: 64,
      right: 20,
      top: 36,
      bottom: 64
    };
    bounds = {
      width: w - padding.left - padding.right,
      height: h - padding.top - padding.bottom
    };
    numWeeks = this.chartData.length;
    ref15 = this.chartData;
    for (s = 0, len7 = ref15.length; s < len7; s++) {
      row = ref15[s];
      maxILI = Math.max(maxILI != null ? maxILI : row.value, row.value);
    }
    maxILI = Math.round(maxILI + 1);
    i2x = function(i) {
      return padding.left + bounds.width * i / (numWeeks - 1);
    };
    ili2y = function(ili) {
      return padding.top + bounds.height * (1 - ili / maxILI);
    };
    trace = function(xx, yy) {
      var _i, ln, ref16, t;
      ln = 0;
      ctx.beginPath();
      for (_i = t = 0, ref16 = xx.length; 0 <= ref16 ? t < ref16 : t > ref16; _i = 0 <= ref16 ? ++t : --t) {
        line[ln](xx[_i], yy[_i]);
        ln |= 1;
      }
      return ctx.stroke();
    };
    write = function(txt, x, y, angle) {
      var ht, wt;
      ht = ctx.measureText('W').width;
      wt = ctx.measureText(txt).width;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle * Math.PI * 2);
      ctx.translate(-wt / 2, +ht / 2);
      ctx.fillText(txt, 0, 0);
      return ctx.restore();
    };
    trace([0, numWeeks - 1].map(i2x), [0, 0].map(ili2y));
    trace([0, 0].map(i2x), [0, maxILI].map(ili2y));
    ctx.font = '16px sans-serif';
    write('Time (weeks)', w / 2, h - padding.bottom / 3, 0);
    prefix = this.chartData[0].location.length > 2 ? 'Weighted ' : '';
    write(prefix + '%ILI', padding.left / 3, h / 2, -0.25);
    ctx.font = '12px sans-serif';
    for (ili = t = 0, ref16 = maxILI; 0 <= ref16 ? t <= ref16 : t >= ref16; ili = 0 <= ref16 ? ++t : --t) {
      y = ili2y(ili);
      trace([padding.left - 6, padding.left], [y, y]);
      if (bounds.height / maxILI >= 32 || ili % 2 === 0) {
        write(ili, 3 * padding.left / 4, y, 0);
      }
    }
    ref17 = ((function() {
      var j1, ref17, results;
      results = [];
      for (i = j1 = 0, ref17 = numWeeks - 10; 0 <= ref17 ? j1 < ref17 : j1 > ref17; i = 0 <= ref17 ? ++j1 : --j1) {
        results.push(i);
      }
      return results;
    })()).concat([numWeeks - 1]);
    for (i1 = 0, len8 = ref17.length; i1 < len8; i1++) {
      i = ref17[i1];
      wk = this.chartData[i].epiweek % 100;
      if (wk === 20 || wk === 40) {
        x = i2x(i);
        trace([x, x], [h - padding.bottom, h - (padding.bottom - 6)]);
        yr = Math.round(this.chartData[i].epiweek / 100) % 100;
        yr = ('00' + yr).slice(-2);
        wk = ('00' + wk).slice(-2);
        write("'" + yr + "w" + wk, x, h - 2 * padding.bottom / 3, -0.125);
      }
    }
    ctx.lineWidth = ctx.lineWidth / 2;
    iVals = (function() {
      var j1, ref18, results;
      results = [];
      for (i = j1 = 0, ref18 = numWeeks; 0 <= ref18 ? j1 < ref18 : j1 > ref18; i = 0 <= ref18 ? ++j1 : --j1) {
        results.push(i);
      }
      return results;
    })();
    if (this.truthData != null) {
      iliVals = (function() {
        var j1, ref18, results;
        results = [];
        for (i = j1 = 0, ref18 = numWeeks - 38; 0 <= ref18 ? j1 < ref18 : j1 > ref18; i = 0 <= ref18 ? ++j1 : --j1) {
          results.push(this.truthData[i].wili);
        }
        return results;
      }).call(this);
      trace(iVals.map(i2x), iliVals.map(ili2y));
    }
    ctx.strokeStyle = '#FF0000';
    iliVals = (function() {
      var j1, ref18, results;
      results = [];
      for (i = j1 = 0, ref18 = numWeeks; 0 <= ref18 ? j1 < ref18 : j1 > ref18; i = 0 <= ref18 ? ++j1 : --j1) {
        results.push(this.chartData[i].value);
      }
      return results;
    }).call(this);
    trace(iVals.map(i2x), iliVals.map(ili2y));
    ctx.font = 12 * Math.min(1, w / 500) + 'px sans-serif';
    ctx.lineWidth = ctx.lineWidth / 2;
    write("Nowcast", w - 3 * padding.right, padding.top, 0);
    ctx.beginPath();
    ctx.moveTo(w - 6 * padding.right, padding.top);
    ctx.lineTo(w - 5 * padding.right, padding.top);
    ctx.stroke();
    if (this.truthData != null) {
      ctx.strokeStyle = '#000';
      write("Ground Truth", w - 3 * padding.right, (3 / 2) * padding.top, 0);
      ctx.beginPath();
      ctx.moveTo(w - 6 * padding.right, (3 / 2) * padding.top);
      ctx.lineTo(w - 5 * padding.right, (3 / 2) * padding.top);
      ctx.stroke();
    }
    ctx.font = 24 * Math.min(1, w / 500) + 'px sans-serif';
    name = NAMES[this.chartData[0].location];
    return write("Historial Nowcasts for " + name, w / 2, padding.top / 2, 0);
  };

  App.prototype.hitTest = function(u, v) {
    var hit, i1, idx, len7, len8, loc, ref14, ref15, ref16, ref17, ref18, ref19, s, t, u1, u2, v1, v2;
    ref14 = this.locations;
    for (s = 0, len7 = ref14.length; s < len7; s++) {
      loc = ref14[s];
      ref15 = geodata.locations[loc].paths;
      for (t = 0, len8 = ref15.length; t < len8; t++) {
        poly = ref15[t];
        hit = false;
        ref16 = this.ecef2ortho.apply(this, geodata.points[poly[0]]), u1 = ref16[0], v1 = ref16[1];
        for (idx = i1 = 1, ref17 = poly.length; 1 <= ref17 ? i1 <= ref17 : i1 >= ref17; idx = 1 <= ref17 ? ++i1 : --i1) {
          ref18 = this.ecef2ortho.apply(this, geodata.points[poly[idx % poly.length]]), u2 = ref18[0], v2 = ref18[1];
          if (((v1 > v) !== (v2 > v)) && ((u1 > u) || (u2 > u)) && (((u1 > u) && (u2 > u)) || (u1 + (v - v1) * (u2 - u1) / (v2 - v1) > u))) {
            hit = !hit;
          }
          ref19 = [u2, v2], u1 = ref19[0], v1 = ref19[1];
        }
        if (hit) {
          return loc;
        }
      }
    }
    return null;
  };

  App.prototype.locCenterOnMap = function(loc) {
    var idx, k, len7, ref14, ref15, ref16, ref17, ref18, ref19, s, t, x, y;
    ref14 = [0, 0, 0], centerX = ref14[0], centerY = ref14[1], k = ref14[2];
    ref15 = geodata.locations[loc].paths;
    for (s = 0, len7 = ref15.length; s < len7; s++) {
      poly = ref15[s];
      for (idx = t = 1, ref16 = poly.length; 1 <= ref16 ? t <= ref16 : t >= ref16; idx = 1 <= ref16 ? ++t : --t) {
        ref17 = this.ecef2ortho.apply(this, geodata.points[poly[idx % poly.length]]), x = ref17[0], y = ref17[1];
        ref18 = [centerX + x, centerY + y], centerX = ref18[0], centerY = ref18[1];
        k++;
      }
    }
    ref19 = [centerX / k, centerY / k], centerX = ref19[0], centerY = ref19[1];
    if (loc === 'AK') {
      centerY = centerY - 10;
    }
    return [centerX, centerY];
  };

  App.prototype.fetchNowcast = function(loc) {
    var callback;
    this.chartData = null;
    this.truthData = null;
    callback = (function(_this) {
      return function(epidata) {
        return _this.onNowcastReceived(epidata);
      };
    })(this);
    return Epidata_nowcast_single(getEpidataHander(callback), loc);
  };

  App.prototype.onNowcastReceived = function(epidata) {
    var callback, current, epiweek, idx, ili, loc, start;
    current = epidata[epidata.length - 1];
    start = epidata[0];
    loc = current.location;
    if (indexOf.call(REGIONS, loc) >= 0 || indexOf.call(NATIONAL, loc) >= 0) {
      callback = (function(_this) {
        return function(ilidata) {
          return _this.onFluviewReceived(ilidata);
        };
      })(this);
      Epidata_fluview_single(getEpidataHander(callback), loc, start.epiweek + "-" + current.epiweek);
    }
    ili = '' + (Math.round(current.value * 100) / 100);
    if (indexOf.call(ili, '.') >= 0) {
      ili += '00';
      idx = ili.indexOf('.');
      ili = ili.slice(0, idx + 3);
    } else {
      ili += '.00';
    }
    epiweek = current.epiweek;
    this.chartData = epidata;
    $('#nowcast_label').text("ILI nowcast for " + loc + " as of " + epiweek + ":");
    $('#nowcast_value').text(ili + "%");
    $('#chart_label').text("Historical ILI nowcasts for " + loc + ":");
    $('.location_right').css('display', 'block');
    $('#loading_icon').css('display', 'none');
    return this.resizeCanvas();
  };

  App.prototype.onFluviewReceived = function(ilidata) {
    this.truthData = ilidata;
    return this.resizeCanvas();
  };

  return App;

})();
