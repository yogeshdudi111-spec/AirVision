let trendChart;
let breakdownChart;

const airData = {
    cities: [
        {
            country: "India",
            city: "Delhi",
            aqi: 312,
            pm25: 185,
            co: 3,
            category: "Very Poor"
        },
        {
            country: "India",
            city: "Chandigarh",
            aqi: 82,
            pm25: 44,
            co: 1,
            category: "Satisfactory"
        },
        {
            country: "India",
            city: "Mumbai",
            aqi: 156,
            pm25: 92,
            co: 2,
            category: "Moderate"
        },
        {
            country: "India",
            city: "Bengaluru",
            aqi: 68,
            pm25: 34,
            co: 1,
            category: "Good"
        },
        {
            country: "India",
            city: "Chennai",
            aqi: 97,
            pm25: 48,
            co: 1,
            category: "Satisfactory"
        },
        {
            country: "India",
            city: "Kolkata",
            aqi: 221,
            pm25: 140,
            co: 3,
            category: "Poor"
        },
        {
            country: "India",
            city: "Hyderabad",
            aqi: 118,
            pm25: 70,
            co: 2,
            category: "Moderate"
        },
        {
            country: "India",
            city: "Pune",
            aqi: 86,
            pm25: 42,
            co: 1,
            category: "Satisfactory"
        },
        {
            country: "India",
            city: "Ahmedabad",
            aqi: 198,
            pm25: 121,
            co: 2,
            category: "Poor"
        },
        {
            country: "India",
            city: "Jaipur",
            aqi: 146,
            pm25: 84,
            co: 2,
            category: "Moderate"
        },
        {
            country: "India",
            city: "Lucknow",
            aqi: 275,
            pm25: 170,
            co: 3,
            category: "Very Poor"
        }
    ]
};

function getSummary(data) {
    let totalAQI = 0;
    let highest = data[0];
    let cleanest = data[0];

    data.forEach((city) => {
        totalAQI += city.aqi;

        if (city.aqi > highest.aqi) {
            highest = city;
        }

        if (city.aqi < cleanest.aqi) {
            cleanest = city;
        }
    });

    return {
        average: Math.round(totalAQI / data.length),
        highestAQI: highest.aqi,
        cleanestCity: cleanest.city,
        pollutedCity: highest.city
    };
}

function getAQICategory(aqi) {
    if (aqi <= 50) return "Good";

    if (aqi <= 100) return "Satisfactory";

    if (aqi <= 200) return "Moderate";

    if (aqi <= 300) return "Poor";

    return "Very Poor";
}

function initTrendChart() {
    const ctx = document.getElementById("trendChart").getContext("2d");

    trendChart = new Chart(ctx, {
        type: "bar",

        data: {
            labels: [],

            datasets: [
                {
                    label: "AQI",

                    data: [],

                    backgroundColor: "#38bdf8",

                    borderRadius: 8
                }
            ]
        },

        options: {
            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initBreakdownChart() {
    const ctx = document.getElementById("breakdownChart").getContext("2d");

    breakdownChart = new Chart(ctx, {
        type: "doughnut",

        data: {
            labels: ["PM2.5", "PM10", "NO₂", "SO₂", "CO"],

            datasets: [
                {
                    data: [],

                    backgroundColor: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"]
                }
            ]
        },

        options: {
            responsive: true,

            maintainAspectRatio: false
        }
    });
}

function updateCharts(data) {
    const sorted = [...data].sort((a, b) => b.aqi - a.aqi);

    trendChart.data.labels = sorted.map((city) => city.city);
    trendChart.data.datasets[0].data = sorted.map((city) => city.aqi);
    trendChart.update();

    let totalPM25 = 0;
    let totalPM10 = 0;
    let totalNO2 = 0;
    let totalSO2 = 0;
    let totalCO = 0;

    data.forEach((city) => {
        totalPM25 += city.pm25;
        totalPM10 += Math.round(city.pm25 * 1.3);
        totalNO2 += Math.round(city.pm25 * 0.7);
        totalSO2 += Math.round(city.pm25 * 0.4);

        totalCO += city.co * 25;
    });

    breakdownChart.data.datasets[0].data = [totalPM25, totalPM10, totalNO2, totalSO2, totalCO];

    breakdownChart.update();
}

function updateDashboard(data) {
    if (data.length === 0) {
        return;
    }

    const summary = getSummary(data);

    document.getElementById("stat-average").innerHTML = summary.average;
    document.getElementById("stat-highest").innerHTML = summary.highestAQI;
    document.getElementById("stat-cleanest").innerHTML = summary.cleanestCity;
    document.getElementById("stat-polluted").innerHTML = summary.pollutedCity;
    document.getElementById("report-average").innerHTML = summary.average;
    document.getElementById("report-highest").innerHTML = summary.highestAQI;
    document.getElementById("report-cleanest").innerHTML = summary.cleanestCity;
    document.getElementById("report-polluted").innerHTML = summary.pollutedCity;

    loadTable(data);
    updateCharts(data);
}

function loadTable(data) {
    const table = document.getElementById("table-body");

    table.innerHTML = "";

    data.forEach((city) => {
        table.innerHTML += `
        <tr>
            <td>${city.country}</td>
            <td>${city.city}</td>
            <td>${city.aqi}</td>
            <td>${city.pm25}</td>
            <td>${city.co}</td>
            <td>${city.category}</td>
        </tr>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initTrendChart();
    initBreakdownChart();
    updateDashboard(airData.cities);
});

function searchCity() {
    const value = document.getElementById("searchCity").value.toLowerCase().trim();

    if (value === "") {
        updateDashboard(airData.cities);
        return;
    }

    const filtered = airData.cities.filter((city) => city.city.toLowerCase().includes(value));

    updateDashboard(filtered);
}

function refreshDashboard() {
    airData.cities.forEach((city) => {
        let change = Math.floor(Math.random() * 31) - 15;
        city.aqi += change;

        if (city.aqi < 0) city.aqi = 0;

        city.pm25 = Math.round(city.aqi * 0.6);
        city.category = getAQICategory(city.aqi);
    });

    updateDashboard(airData.cities);

    document.getElementById("update-time").innerHTML = "Last Updated : " + new Date().toLocaleTimeString();
}

function downloadCSV() {
    let csv = "Country,City,AQI,PM2.5,CO AQI,Category\n";

    airData.cities.forEach((city) => {
        csv += `${city.country},${city.city},${city.aqi},${city.pm25},${city.co},${city.category}\n`;
    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "AirVision_Data.csv";

    a.click();
}

function downloadJSON() {
    const blob = new Blob(
        [JSON.stringify(airData, null, 2)],

        {
            type: "application/json"
        }
    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "AirVision_Data.json";

    a.click();
}

function exportData(type) {
    if (type === "csv") {
        downloadCSV();
    } else {
        downloadJSON();
    }
}

document.getElementById("searchCity").addEventListener("keyup", searchCity);
document.getElementById("btn-refresh").addEventListener("click", refreshDashboard);
