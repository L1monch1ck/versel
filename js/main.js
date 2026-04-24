// ====================== ИНИЦИАЛИЗАЦИЯ КАРТЫ ======================
const map = L.map('map', {
    zoomControl: true
}).setView([3.1390, 101.6869], 16);   // ← Координаты твоего кампуса (Cyberjaya / MMU)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Круг кампуса (чтобы было понятно границы)
L.circle([3.1390, 101.6869], {
    color: '#3b82f6',
    fillColor: '#3b82f6',
    fillOpacity: 0.08,
    radius: 400
}).addTo(map);

// Массив маркеров
let markers = [];

// Загрузка всех отчётов
async function loadReports() {
    try {
        const res = await fetch("http://127.0.0.1:8000/reports");
        const data = await res.json();

        // Удаляем старые маркеры
        markers.forEach(m => map.removeLayer(m));
        markers = [];

        data.forEach(report => {
            const color = report.status === "resolved" ? "#22c55e" : "#ef4444";

            const marker = L.circleMarker([report.lat, report.lng], {
                radius: 9,
                fillColor: color,
                color: "#ffffff",
                weight: 3,
                fillOpacity: 0.9
            }).addTo(map);

            marker.bindPopup(`
                <b>${report.title}</b><br>
                ${report.description || ''}<br><br>
                Status: <strong style="color:${color}">${report.status}</strong>
            `);

            markers.push(marker);
        });
    } catch (err) {
        console.error("Failed to load reports:", err);
    }
}

// Клик по карте → переход на страницу отчёта с координатами
map.on('click', function(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    
    // Переходим на страницу Report и передаём координаты через URL
    window.location.href = `report.html?lat=${lat}&lng=${lng}`;
});

// Загрузка статистики
async function loadStats() {
    try {
        const res = await fetch("http://127.0.0.1:8000/stats");
        const data = await res.json();

        document.getElementById("total").innerText = data.total || 0;
        document.getElementById("pending").innerText = data.pending || 0;
        document.getElementById("resolved").innerText = data.resolved || 0;
    } catch (err) {
        console.error("Failed to load stats");
    }
}

// Инициализация
loadReports();
loadStats();

// Автообновление каждые 15 секунд
setInterval(() => {
    loadReports();
    loadStats();
}, 15000);