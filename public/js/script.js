
const socket = io();

socket.on('connect', () => {
    console.log('Connected to server, socket ID:', socket.id);
});

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            let { latitude, longitude } = position.coords;
            console.log('Sending location:', { latitude, longitude });
            socket.emit('send-location', { latitude, longitude });
        },
        (error) => {
            console.error('Geolocation error:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
} else {
    console.error('Geolocation is not supported by this browser.');
}

const map = L.map('map').setView([0, 0], 16);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'My Location'
}).addTo(map);

const markers = {};

socket.on('recieve-location', (data) => {
    console.log('Received location data:', data);
    const { id, latitude, longitude } = data;

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
    map.setView([latitude, longitude]);
});

socket.on('client-disconnected', (id) => {
    console.log('Client disconnected, removing marker for ID:', id);
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});


