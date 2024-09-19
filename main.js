// Initialize the map
var map = L.map('map').setView([24.7637, 90.4056], 13); // Use your desired coordinates

// Add a tile layer (in this example, we'll use the Mapnik style)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Array of GeoJSON file paths
const geoJsonFiles = [
    'BaseMap.geojson',
    'Roads.geojson',
];

// Function to fetch and add GeoJSON layers to the map
function loadGeoJsonFiles(files) {
    Promise.all(files.map(file => 
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Check if the data is in GeoJSON format
                if (data.features) {
                    return data;
                } else {
                    // Wrap the data in a GeoJSON-compatible format
                    return {
                        type: "FeatureCollection",
                        features: [
                            {
                                type: "Feature",
                                geometry: null,
                                properties: data
                            }
                        ]
                    };
                }
            })
    ))
    .then(dataArray => {
        dataArray.forEach(data => {
            L.geoJSON(data, {
                onEachFeature: function (feature, layer) {
                    // Customize popup content if needed
                    layer.bindPopup(feature.properties.name || "No Name");
                }
            }).addTo(map);
        });
    })
    .catch(err => console.error('Fetch error:', err));
}

// Load the GeoJSON files
loadGeoJsonFiles(geoJsonFiles); 