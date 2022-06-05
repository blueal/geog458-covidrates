mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 4, // starting zoom
    center: [-98, 39], // starting center
    projection: 'albers'
});

const layers = [
    '0-9',
    '10-19',
    '20-49',
    '50-99',
    '100-199',
    '200-499',
    '500-999',
    '1000+'
];
const colors = [
    '#FFEDA0',
    '#FED976',
    '#FEB24C',
    '#FD8D3C',
    '#FC4E2A',
    '#E31A1C',
    '#BD0026',
    '#800026'
];

//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function

    // when loading a geojson, there are two steps
    // add a source of the data and then add the layer out of the source
    map.addSource('cov19-rates', {
        type: 'geojson',
        data: 'assets/us-covid-2020-rates.geojson'
    });

    map.addLayer({
        'id': 'rates-layer',
        'type': 'fill',
        'source': 'cov19-rates',
        'paint': {
            'fill-color': [
                'step',
                ['get', 'rates'],
                '#FFEDA0',   // stop_output_0
                10,          // stop_input_0
                '#FED976',   // stop_output_1
                20,          // stop_input_1
                '#FEB24C',   // stop_output_2
                50,          // stop_input_2
                '#FD8D3C',   // stop_output_3
                100,         // stop_input_3
                '#FC4E2A',   // stop_output_4
                200,         // stop_input_4
                '#E31A1C',   // stop_output_5
                500,         // stop_input_5
                '#BD0026',   // stop_output_6
                1000,        // stop_input_6
                "#800026"    // stop_output_7
            ],
            'fill-outline-color': '#BBBBBB',
            'fill-opacity': 0.7,
        }
    });



    // click on tree to view a popup
    map.on('click', 'rates-layer', (event) => {
        //console.log(event.features[0])
        new mapboxgl.Popup()
            .setLngLat(event.lngLat)
            .setHTML(`${event.features[0].properties.county}
                    ${event.features[0].properties.state}<br />
                    <strong>Population:</strong> ${event.features[0].properties.pop18}<br />
                    <strong>Cases:</strong> ${event.features[0].properties.cases}<br />
                    <strong>Rates:</strong> ${event.features[0].properties.rates}<br />
                    <strong>Deaths:</strong> ${event.features[0].properties.deaths}`)
            .addTo(map);
            
    });

});


// create legend
const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<span id="legend-title">Covid Case Rates</span>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
labels.push('<div id="map1-legend-labels">');
for (var i = 0; i < layers.length; i++) {
    vbreak = layers[i];
    dot_radii = 20;
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');

}
labels.push('</div>');
// add the data source
const source =
    '<p style="text-align: center; font-size:10pt">Source:<br><a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times</a></p>';
// combine all the html codes.
legend.innerHTML = labels.join('') + source;