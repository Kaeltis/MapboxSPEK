const version = '0.7.1';

// define access token
mapboxgl.accessToken = 'pk.eyJ1IjoicGZydWgiLCJhIjoiY2l4aG1oODhkMDAwdTJ6bzIzM3A0eG5qOSJ9.0YfW_nJrhdJNLIFPXypZgw';

//create map
const map = new mapboxgl.Map({
    container: 'map', // container id
    //style: 'mapbox://styles/pfruh/cixswel7n001u2ro5tm5e4hco', // Light Style
    style: 'mapbox://styles/pfruh/cixti4qmn00492so6g4aw5cuc', // Dark Style
    center: [6.960347, 50.937599],
    zoom: 12,
    minZoom: 12,
    maxBounds: [[6.742486, 50.839562], [7.197363, 51.096117]]
});

map.getCanvas().style.cursor = 'default';

// define layer names
const namings = {
    "bahn-75": "Bahn - DB",
    "bahn-70": "Bahn - DB",
    "bahn-65": "Bahn - DB",
    "bahn-60": "Bahn - DB",
    "bahn-55": "Bahn - DB",
    "bahn-kvb-hgk-75": "Bahn - KVB & HGK",
    "bahn-kvb-hgk-70": "Bahn - KVB & HGK",
    "bahn-kvb-hgk-65": "Bahn - KVB & HGK",
    "bahn-kvb-hgk-60": "Bahn - KVB & HGK",
    "bahn-kvb-hgk-55": "Bahn - KVB & HGK",
    "industrie-hafen-75": "Industrie & Hafen",
    "industrie-hafen-70": "Industrie & Hafen",
    "industrie-hafen-65": "Industrie & Hafen",
    "industrie-hafen-60": "Industrie & Hafen",
    "industrie-hafen-55": "Industrie & Hafen",
    "strasse-75": "Straße",
    "strasse-70": "Straße",
    "strasse-65": "Straße",
    "strasse-60": "Straße",
    "strasse-55": "Straße",
    "gruen": "Grünfläche"
};
const layers = Object.keys(namings);
const legendLayers = ['bahn-75', 'bahn-kvb-hgk-75', 'industrie-hafen-75', 'strasse-75', 'gruen'];

const toggleableMapLayers = {
    "Bahn - DB": ["bahn-75", "bahn-70", "bahn-65", "bahn-60", "bahn-55"],
    "Bahn - KVB & HGK": ["bahn-kvb-hgk-75", "bahn-kvb-hgk-70", "bahn-kvb-hgk-65", "bahn-kvb-hgk-60", "bahn-kvb-hgk-55"],
    "Industrie & Hafen": ["industrie-hafen-75", "industrie-hafen-70", "industrie-hafen-65", "industrie-hafen-60", "industrie-hafen-55"],
    "Straße": ["strasse-75", "strasse-70", "strasse-65", "strasse-60", "strasse-55"]
};

const pch = document.getElementById("piechart");
const pieChart = new Chart(pch, {
    type: 'pie',
    data: {
        labels: ["DB", "KVB & HGK", "Industrie & Hafen", "Straße", "Lärmfrei"],
        datasets: [{
            data: [10, 10, 10, 10, 10],
            backgroundColor: [
                'rgba(208, 18, 30, 0.2)',
                'rgba(247, 167, 35, 0.2)',
                'rgba(28, 118, 166, 0.2)',
                'rgba(87, 87, 86, 0.2)',
                'rgba(0, 255, 0, 0.2)'
            ],
            borderColor: [
                'rgba(208, 18, 30, 1)',
                'rgba(247, 167, 35, 1)',
                'rgba(28, 118, 166, 1)',
                'rgba(87, 87, 86, 1)',
                'rgba(0, 255, 0, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        title: {
            display: false,
            text: 'Lärmbelastung'
        },
        legend: {
            display: false
        },
        pieceLabel: {
            fontSize: 12,
            fontColor: '#000',
            fontStyle: 'strong',
            fontFamily: "'Open Sans', sans-serif"
        }
    }
});

const bch = document.getElementById("barchart");
const barChart = new Chart(bch, {
    type: 'horizontalBar',
    data: {
        labels: ["DB", "KVB & HGK", "Industrie & Hafen", "Straße"],
        datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgba(208, 18, 30, 0.2)',
                'rgba(247, 167, 35, 0.2)',
                'rgba(28, 118, 166, 0.2)',
                'rgba(87, 87, 86, 0.2)'
            ],
            borderColor: [
                'rgba(208, 18, 30, 1)',
                'rgba(247, 167, 35, 1)',
                'rgba(28, 118, 166, 1)',
                'rgba(87, 87, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Lärmausprägung'
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                ticks: {
                    max: 75,
                    min: 50,
                    stepSize: 5
                }
            }],
            yAxes: [{
                display: false
            }]
        }
    }
});

// wait for map to load before adjusting it
map.on('load', function () {
    //map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
    }));

    const attrib = document.getElementsByClassName("mapboxgl-ctrl-attrib")[0];

    attrib.innerHTML = 'v' + version + ' ' + attrib.innerHTML;

    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': {
                'type': 'identity',
                'property': 'height'
            },
            'fill-extrusion-base': {
                'type': 'identity',
                'property': 'min_height'
            },
            'fill-extrusion-opacity': .6
        }
    });

    // create legend
    /*
     legendLayers.forEach(function (layer) {
     const color = map.getPaintProperty(layer, 'fill-color');
     const item = document.createElement('div');
     const key = document.createElement('span');
     key.className = 'legend-key';
     key.style.backgroundColor = color;

     const value = document.createElement('span');
     value.innerHTML = namings[layer];
     item.appendChild(key);
     item.appendChild(value);
     legend.appendChild(item);
     });
     */

    // change stuff on hover over layer
    map.on('mousemove', function (e) {
        const regions = map.queryRenderedFeatures(e.point, {
            layers: layers
        });

        let hasGreen = false;

        let maxBahn = 0;
        let maxBahnKvbHgk = 0;
        let maxIndustrieHafen = 0;
        let maxStrasse = 0;

        if (regions.length > 0) {
            regions.forEach(function (region) {
                if (region.layer.id == 'gruen') {
                    // Grünfläche
                    document.getElementById('pd').innerHTML = "<h3><strong>" + region.properties.Name + "</strong></h3><p>Fläche: <strong>" + parseFloat(turf.area(region) / 10000).toFixed(2) + " Hektar</strong></p>";
                    if (!hasGreen) {
                        hasGreen = true;
                        currentGreenRegion = region;
                        currentPoint = e.point;
                    }
                    map.setFilter("gruen-hover", ["==", "Name", region.properties.Name]);
                } else if (region.layer.id.includes('bahn-kvb-hgk') && maxBahnKvbHgk < region.properties.DBA) {
                    maxBahnKvbHgk = region.properties.DBA;
                } else if (region.layer.id.includes('bahn') && maxBahn < region.properties.DBA) {
                    maxBahn = region.properties.DBA;
                } else if (region.layer.id.includes('industrie-hafen') && maxIndustrieHafen < region.properties.DBA) {
                    maxIndustrieHafen = region.properties.DBA;
                } else if (region.layer.id.includes('strasse') && maxStrasse < region.properties.DBA) {
                    maxStrasse = region.properties.DBA;
                }
            });
        } else {
            document.getElementById('pd').innerHTML = '<p>Please hover over a region!</p>';
            map.setFilter("gruen-hover", ["==", "Name", "DISABLED"]);
        }

        barChart.data.datasets[0].data = [maxBahn, maxBahnKvbHgk, maxIndustrieHafen, maxStrasse];
        barChart.update();

        if (hasGreen) {
            document.getElementById('piechart').style.visibility = "visible";
            document.getElementById('features').style.visibility = "visible";
        } else {
            document.getElementById('piechart').style.visibility = "hidden";
            document.getElementById('features').style.visibility = "hidden";
            currentGreenRegion = undefined;
            currentPoint = undefined;
        }
    });

    map.on("mouseout", function () {
        map.setFilter("gruen-hover", ["==", "Name", "DISABLED"]);
    });
});

let currentGreenRegion;
let currentPoint;
updateChart();
function updateChart() {
    if (!(currentGreenRegion != undefined && currentPoint != undefined)) {
        setTimeout(updateChart, 100);
        return;
    }

    pieChart.data.datasets[0].data[0] = 0;
    pieChart.data.datasets[0].data[1] = 0;
    pieChart.data.datasets[0].data[2] = 0;
    pieChart.data.datasets[0].data[3] = 0;
    pieChart.data.datasets[0].data[4] = 0;

    const clone = layers.slice(0);
    clone.pop();

    let greenSize;

    try {
        greenSize = turf.area(currentGreenRegion);
    } catch (err) {
        console.error(err.message);
        greenSize = 0;
    }

    /*
     var regionsToCheck = map.queryRenderedFeatures({
     layers: clone
     });
     */

    //TODO: better calculate size to check for
    //too big = lag, too small = missing layers
    const width = map.getZoom() * 15;
    const height = map.getZoom() * 15;
    const regionsToCheck = map.queryRenderedFeatures([
        [currentPoint.x - width / 2, currentPoint.y - height / 2],
        [currentPoint.x + width / 2, currentPoint.y + height / 2]
    ], {
        layers: clone
    });

    const noiseFreeArea = currentGreenRegion;
    regionsToCheck.forEach(function (region) {
        let intersection;

        // error-prone, catch major derps
        try {
            intersection = turf.intersect(currentGreenRegion, region);
        } catch (err) {
            console.error(err.message);
            intersection = undefined;
        }

        if (intersection != undefined) {
            //TODO: fix calculation
            //noiseFreeArea = turf.difference(noiseFreeArea, region);

            if (region.layer.id.includes('bahn-kvb-hgk'))
                pieChart.data.datasets[0].data[1] += turf.area(intersection) * 100 / greenSize;
            else if (region.layer.id.includes('bahn'))
                pieChart.data.datasets[0].data[0] += turf.area(intersection) * 100 / greenSize;
            else if (region.layer.id.includes('industrie-hafen'))
                pieChart.data.datasets[0].data[2] += turf.area(intersection) * 100 / greenSize;
            else if (region.layer.id.includes('strasse'))
                pieChart.data.datasets[0].data[3] += turf.area(intersection) * 100 / greenSize;
        }
    });

    pieChart.data.datasets[0].data[4] = 100 - pieChart.data.datasets[0].data[0] - pieChart.data.datasets[0].data[1] - pieChart.data.datasets[0].data[2] - pieChart.data.datasets[0].data[3];

    pieChart.update();

    setTimeout(updateChart, 250);
}

for (let layer in toggleableMapLayers) {
    const link = document.createElement('a');
    link.href = '#';
    link.className = removeLayerDba(toggleableMapLayers[layer][0]);
    link.textContent = layer;

    link.onclick = function (e) {
        const clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        toggleableMapLayers[clickedLayer].forEach((layer) => {
            const visibility = map.getLayoutProperty(layer, 'visibility');

            if (visibility === 'visible') {
                map.setLayoutProperty(layer, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = removeLayerDba(layer);
                map.setLayoutProperty(layer, 'visibility', 'visible');
            }
        });
    };

    const layersMenu = document.getElementById('menu');
    layersMenu.appendChild(link);
}

function removeLayerDba(layername) {
    return layername.slice(0, -3);
}