// const apiKey = '6d055e39ee237af35ca066f35474e9df';
// const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
// const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
// const backgroundImages = {
//     Clear: "url('https://media.istockphoto.com/id/1007768414/photo/blue-sky-with-bright-sun-and-clouds.jpg?s=612x612&w=0&k=20&c=MGd2-v42lNF7Ie6TtsYoKnohdCfOPFSPQt5XOz4uOy4=')",
//     Clouds: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBvmvfQGnZOPZ0s2dgGwYzFN_JxvNGCdwcxQ&s')",
//     Rain: "url('https://media.istockphoto.com/id/1441947622/photo/heavy-rain-with-a-vintage-umbrella-revealing-a-blue-sky.jpg?s=612x612&w=0&k=20&c=ZraFCdraJthWx8E7d95JbXWW7nrGZFlcFeXz58USHxM=')",
//     Default: "url('https://images.unsplash.com/photo-1503264116251-35a269479413?fit=crop&w=1500&q=80')" // optional
// };


// // 🕒 Update clock and greeting
// function updateTime() {
//     const now = new Date();
//     document.getElementById('time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
//     const hour = now.getHours();
//     let greeting = 'Good Night';
//     if (hour < 12) greeting = 'Good Morning';
//     else if (hour < 18) greeting = 'Good Afternoon';
//     else greeting = 'Good Evening';

//     document.querySelector('.greeting h3').textContent = greeting;
// }

// // 🌦️ Get current weather and forecast
// async function getWeather(city) {
//     try {
//         const weatherRes = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`);
//         const weatherData = await weatherRes.json();

//         const forecastRes = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`);
//         const forecastData = await forecastRes.json();

//         updateCurrentWeather(weatherData);
//         updateHourlyForecast(forecastData.list.slice(0, 6)); // 3-hour intervals × 6 = 18 hours
//         updateWeeklyForecast(forecastData.list); // We'll group this into daily

//     } catch (error) {
//         alert("City not found or network error.");
//         console.error(error);
//     }
// }

// // 🌡️ Current weather
// function updateCurrentWeather(data) {
//     const condition = data.weather[0].main;

//     document.querySelector(".location").textContent = data.name;
//     document.querySelector(".mainBox .tempBox h1").textContent = `${Math.round(data.main.temp)}°`;
//     document.querySelector(".mainBox .conditions h1").textContent = condition;

//     document.querySelector(".sideBox .temprature h1").textContent = `${Math.round(data.main.temp)}°`;
//     document.querySelector(".sideBox .conditions").textContent = condition;

//     // 🌅 Set background based on weather
//     const bg = backgroundImages[condition] || backgroundImages.Default;
//     document.body.style.backgroundImage = bg;
//     document.body.style.backgroundSize = "cover";
//     document.body.style.backgroundPosition = "center";
//     document.body.style.backgroundRepeat = "no-repeat";
// }


// // 🕓 Hourly forecast (6 items)
// function updateHourlyForecast(data) {
//     data.forEach((hourData, index) => {
//         const date = new Date(hourData.dt * 1000);
//         const hour = date.getHours();
//         const ampm = hour >= 12 ? 'PM' : 'AM';
//         const formattedHour = `${hour % 12 || 12} ${ampm}`;

//         document.querySelector(`#hour${index + 1} .day`).textContent = formattedHour;
//         document.querySelector(`#temp${index + 1}`).textContent = `${Math.round(hourData.main.temp)}°C`;
//         document.querySelector(`#cond${index + 1}`).textContent = hourData.weather[0].main;
//     });
// }

// // 📅 Weekly forecast (daily summary from forecast list)
// function updateWeeklyForecast(data) {
//     const dailyMap = {};

//     data.forEach(item => {
//         const date = new Date(item.dt_txt).toDateString();
//         if (!dailyMap[date]) dailyMap[date] = [];
//         dailyMap[date].push(item);
//     });

//     const days = Object.keys(dailyMap).slice(0, 6);

//     days.forEach((day, index) => {
//         const avgTemp = dailyMap[day].reduce((sum, item) => sum + item.main.temp, 0) / dailyMap[day].length;
//         const mainCondition = dailyMap[day][0].weather[0].main;
//         const dayName = new Date(day).toLocaleDateString('en-US', { weekday: 'short' });

//         const boxes = document.querySelectorAll(".sideBox .day-box");
//         if (boxes[index]) {
//             boxes[index].querySelector(".day").textContent = dayName;
//             boxes[index].querySelector(".temp").textContent = `${Math.round(avgTemp)}°C`;
//             boxes[index].querySelector(".condition").textContent = mainCondition;
//         }
//     });
// }

// // 🔍 Search button
// document.querySelector("button").addEventListener("click", () => {
//     const city = document.querySelector("input").value.trim();
//     if (city) getWeather(city);
// });

// // ✅ On page load
// window.onload = () => {
//     updateTime();
//     setInterval(updateTime, 1000);
//     getWeather("Patti"); // default city
// };



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
});

window.onload = () => {
    updateTime();
    setInterval(updateTime, 1000);
    getWeather("Patti");
};
