var earthquake_link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
function markerS(magnitude) {
    return magnitude * 30000;
}
function colors(magnitude) {
    if (magnitude <= 1) {
        return "#bd8c70";
    } else if (magnitude <= 2) {
        return "#aed75b";
    } else if (magnitude <= 3) {
        return "#a4d247";
    } else if (magnitude <= 4) {
        return "#9acd32";
    } else if (magnitude <= 5) {
        return "#FF4500";
    } else {
        return "#FF0000"
    };
}

//get the url
d3.json(earthquake_link, function (earthquake_data) {
    createFeatures(earthquake_data.features);

});
function createFeatures(quake_data) {
    var quakes = L.geoJSON(quake_data, {
        eachFeature: function (feature, layer) {
            layer.bindPop("<h3>" + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " + feature.properties.mag + "</p>")
        }, pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
                {
                    radius: markerS(feature.properties.mag),
                    fill_color: colors(feature.properties.mag),
                    fill_opacity: 1,
                    stroke: false,
                })

        }
    });
    createMap(quakes);
}
function createMap(quakes) {
    var quake_map = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
        maxzoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });
    var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
        maxzoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });
    var baseMaps = {
        "Satellite Map": quake_map,
        "Dark Map": darkMap,
    };
    var overLays = {
        Earthquakes: quakes
    };

    var finalMap = L.map("map", {
        center: [40.796768, -74.481544],
        zoom: 3,
        layers: [quake_map, quakes]
    });
    L.control.layers(baseMaps, overLays, {
        collapsed: false
    }).addTo(finalMap);

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (finalMap) {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5];

        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style = "background: ' + colors(magnitudes[i] + 1) + ' "></i> ' +
                + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : '+');

        }
        return div;
    };
    legend.addTo(finalMap);

}
