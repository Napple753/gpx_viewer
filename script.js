// Initialize the map
const map = L.map('map').setView([0, 0], 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Load the points data
fetch('output/points_data.json')
    .then(response => response.json())
    .then(data => {
        const points = data.points;
        console.log(points);
        let index = 0;

            // Create a marker and add it to the map
            const marker = L.marker([0, 0]).addTo(map);

            // Create a polyline and add it to the map
            const polyline = L.polyline([], { color: 'lightblue' }).addTo(map);
            const traveledPath = L.polyline([], { color: 'blue' }).addTo(map);

            // Add all points to the polyline
            points.forEach(point => {
                polyline.addLatLng([point.lat, point.lng]);
            });
            // Fit the map view to the polyline
            map.fitBounds(polyline.getBounds());

            // Function to move the marker to a new point
            function moveMarker() {
                if (index < points.length) {
                    const point = points[index];
                    marker.setLatLng([point.lat, point.lng]);
                    traveledPath.addLatLng([point.lat, point.lng]);
                    
                    index++;
                    setTimeout(moveMarker, 100); // Adjust the interval as needed
                }
            }

        // Start the animation
        moveMarker();
    })
    .catch(error => console.error('Error loading points data:', error));
