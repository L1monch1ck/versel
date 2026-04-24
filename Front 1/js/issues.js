var map = L.map('map', {
    zoomControl: true,
    attributionControl: true
}).setView([3.1390, 101.6869], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Красивая кастомизация маркеров
let markers = [];

function loadReports(filter = "all") {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    fetch("http://127.0.0.1:8000/reports")
        .then(res => res.json())
        .then(data => {
            data.forEach(r => {
                if (filter !== "all" && r.status !== filter) return;

                const color = r.status === "resolved" ? "#22c55e" : "#ef4444";

                const marker = L.circleMarker([r.lat, r.lng], {
                    radius: 9,
                    fillColor: color,
                    color: "#fff",
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 0.9
                }).addTo(map);

                marker.bindPopup(`
                    <b>${r.title}</b><br>
                    ${r.description || ''}<br><br>
                    <strong>Status:</strong> 
                    <span style="color:${color}">${r.status}</span>
                `, {
                    closeButton: true,
                    className: 'custom-popup'
                });

                markers.push(marker);
            });
        })
        .catch(err => console.error("Error loading reports:", err));
}

// Загрузка при старте
loadReports();

// Активация кнопок фильтра
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});     