// Store geoQuery to USGS json
var geoQuery = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

//Create a function to assign the size of the circle markers
function circleRadius(mag) {
  return mag * 30000;
}

//Create a function to assign the color of the circle markers based on the magnitude of the earthquake
function circleColor(mag) {
  if (mag <= 1) {
      return "#ffffd4";
  } else if (mag <= 2) {
      return "#fee391";
  } else if (mag <= 3) {
      return "#fec44f";
  } else if (mag <= 4) {
      return "#fe9929";
  } else if (mag <= 5) {
      return "#d95f0e";
  } else {
      return "#993404";
  };
}

// Use d3 to query the USGS json URL 
d3.json(geoQuery, function(data) {
  //Show earthquake data in console
  console.log(data.features);
  createMarkers(data.features);
});

function createMarkers(earthquakeData) {
//Define the earthquake object, then create a function going through the data to assign circles to each earthquake according to the size and color defined above.
  var earthquakes = L.geoJSON(earthquakeData, {
//Add a popup with information on the location, date, and time
 onEachFeature: function(feature, layer) {
    layer.bindPopup("<h4><p>Location: " + feature.properties.place + "</p></h4><p>" + Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, coordinates) {
      return L.circle(coordinates,
        {radius: circleRadius(feature.properties.mag),
        fillColor: circleColor(feature.properties.mag),
        fillOpacity: .8,
        stroke: true,
        color: "#252525",
        weight: .5
    })
  }
  });

//Add the earthquakes to the map
  createLayer(earthquakes);
}

  function createLayer(earthquakes) {

  // Define background map 
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });

    // Create our map with lightmap and earthquakes layer
    var map = L.map("map", {
        center: [32, -100],
        zoom: 3,
        layers: [lightmap,earthquakes],
    });
    
//Define the legend
    var legend = L.control({position: 'bottomright'});
    
//Function loops through the magnitude limits to create bins corresponding to the colors defined above
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            mags = [0, 1, 2, 3, 4, 5]
        
        var legendInfo = "<p>Earthquake<br>Magnitude</p>"
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < mags.length; i++) {
            legendInfo +=
                '<i style="background:' + circleColor(mags[i] + 1) + '"></i> ' +
                mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
        }
        div.innerHTML = legendInfo;
        return div;
    };
    
    legend.addTo(map);

}

