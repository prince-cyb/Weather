const apiKey = 'a9ea351a6bb04822a3040515252707';

const input = document.querySelector('input');
const suggestionsBox = document.getElementById('suggestions');

input.addEventListener('input', async () => {
  const query = input.value.trim();
  if (!query) {
    suggestionsBox.innerHTML = '';
    return;
  }

  const res = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);
  const results = await res.json();

  suggestionsBox.innerHTML = '';
  results.forEach(loc => {
    const li = document.createElement('li');
    li.textContent = `${loc.name}, ${loc.region}, ${loc.country}`;
    li.addEventListener('click', () => {
      input.value = loc.name;
      suggestionsBox.innerHTML = '';
      getWeather(loc.name);
    });
    suggestionsBox.appendChild(li);
  });
});


function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const hour = now.getHours();
    let greeting = 'Good Night';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';

    document.querySelector('.greeting h3').textContent = greeting;
}

async function getWeather(city) {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`);
        const data = await res.json();

        updateCurrentWeather(data);
        updateHourlyForecast(data.forecast.forecastday[0].hour);
        updateDailyForecast(data.forecast.forecastday.slice(1, 7));
    } catch (err) {
        alert("Failed to fetch weather data.");
        console.error(err);
    }
}

function updateCurrentWeather(data) {
    const condition = data.current.condition.text;
    document.querySelector(".location").textContent = data.location.name;
    document.querySelector(".mainBox .tempBox h1").textContent = `${Math.round(data.current.temp_c)}°`;
    document.querySelector(".mainBox .conditions h1").textContent = condition;
    document.getElementById('realfeel').textContent = `${Math.round(data.current.feelslike_c)}°C`;

    document.querySelector(".sideBox .conditions").textContent = condition;

    const bgMap = {
        clear: "url('https://media.istockphoto.com/id/1726364193/photo/blue-sky-background.jpg?s=1024x1024&w=is&k=20&c=XIpo-LiL0cvXZmK4GrzzWB1bcLaBpNhw0_BS6TmPkog=')",
        cloud: "url('https://media.istockphoto.com/id/157527872/photo/storm-cloud.jpg?s=1024x1024&w=is&k=20&c=bX9T0wxwo4YUBXjBXOD76eER6jJ9H73i0M3-XFvMbno=')",
        rain: "url('https://media.istockphoto.com/id/498063665/photo/rainy-landscape.jpg?s=1024x1024&w=is&k=20&c=JmmkAKBNVz2QC2YaXGl8lLvYQYrn6SYXt_FPtN-8JUc=')",
        default: "url('https://media.istockphoto.com/id/947314334/photo/blue-sky-with-bright-sun.jpg?s=612x612&w=0&k=20&c=XUlLAWDXBLYdTGIl6g_qHQ9IBBw4fBvkVuvL2dmVXQw=')"
    };

    const conditionKey = condition.toLowerCase();
    const matchedKey = Object.keys(bgMap).find(key => conditionKey.includes(key)) || 'default';

    document.body.style.backgroundImage = bgMap[matchedKey];
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
}

function updateHourlyForecast(hourly) {
    const now = new Date();
    const currentHour = now.getHours();

    for (let i = 1; i <= 6; i++) {
        const hourData = hourly.find(h => new Date(h.time).getHours() === (currentHour + i) % 24);
        if (!hourData) continue;

        const hourBox = document.getElementById(`hour${i}`);
        const hour = new Date(hourData.time).getHours();
        const hour12 = hour % 12 || 12;
        const ampm = hour >= 12 ? "PM" : "AM";

        hourBox.querySelector(".day").textContent = `${hour12} ${ampm}`;
        hourBox.querySelector(".temp").textContent = `${Math.round(hourData.temp_c)}°C`;
        hourBox.querySelector(".condition").textContent = hourData.condition.text;
    }
}

function updateDailyForecast(days) {
    days.forEach((day, index) => {
        const date = new Date(day.date);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });

        document.querySelector(`#day${index + 1} .day`).textContent = weekday;
        document.querySelector(`#tempd${index + 1}`).textContent = `${Math.round(day.day.avgtemp_c)}°C`;
        document.querySelector(`#condd${index + 1}`).textContent = day.day.condition.text;
    });
}

document.querySelector("button").addEventListener("click", () => {
    const city = document.querySelector("input").value.trim();
    if (city) getWeather(city);
    suggestionsBox.innerHTML = '';
});

window.onload = () => {
    updateTime();
    setInterval(updateTime, 1000);
    getWeather("25.882470, 82.280726");
};
