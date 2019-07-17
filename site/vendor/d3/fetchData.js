"use strict";
function init() {
  var a = createRandomData(90, [0, 1], 0.1),
    b = d3_timeseries()
      .addSerie(
        a,
        { x: "date", y: "n", diff: "n3" },
        { interpolate: "monotone", color: "#333" }
      )
      .width(820);
  b("#chart");
}
document.addEventListener("DOMContentLoaded", function() {
  init();
});
