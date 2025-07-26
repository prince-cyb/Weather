const apiKey = '6d055e39ee237af35ca066f35474e9df';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const backgroundImages = {
    Clear: "url('https://media.istockphoto.com/id/1007768414/photo/blue-sky-with-bright-sun-and-clouds.jpg?s=612x612&w=0&k=20&c=MGd2-v42lNF7Ie6TtsYoKnohdCfOPFSPQt5XOz4uOy4=')",
    Clouds: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBvmvfQGnZOPZ0s2dgGwYzFN_JxvNGCdwcxQ&s')",
    Rain: "url('https://media.istockphoto.com/id/1441947622/photo/heavy-rain-with-a-vintage-umbrella-revealing-a-blue-sky.jpg?s=612x612&w=0&k=20&c=ZraFCdraJthWx8E7d95JbXWW7nrGZFlcFeXz58USHxM=')",
    Default: "url('https://images.unsplash.com/photo-1503264116251-35a269479413?fit=crop&w=1500&q=80')" // optional
};


// 🕒 Update clock and greeting
function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const hour = now.getHours();
    let greeting = 'Good Night';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';

    document.querySelector('.greeting h3').textContent = greeting;
}

// 🌦️ Get current weather and forecast
async function getWeather(city) {
    try {
        const weatherRes = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`);
        const weatherData = await weatherRes.json();

        const forecastRes = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastRes.json();

        updateCurrentWeather(weatherData);
        updateHourlyForecast(forecastData.list.slice(0, 6)); // 3-hour intervals × 6 = 18 hours
        updateWeeklyForecast(forecastData.list); // We'll group this into daily

    } catch (error) {
        alert("City not found or network error.");
        console.error(error);
    }
}

// 🌡️ Current weather
function updateCurrentWeather(data) {
    const condition = data.weather[0].main;

    document.querySelector(".location").textContent = data.name;
    document.querySelector(".mainBox .tempBox h1").textContent = `${Math.round(data.main.temp)}°`;
    document.querySelector(".mainBox .conditions h1").textContent = condition;

    document.querySelector(".sideBox .temprature h1").textContent = `${Math.round(data.main.temp)}°`;
    document.querySelector(".sideBox .conditions").textContent = condition;

    // 🌅 Set background based on weather
    const bg = backgroundImages[condition] || backgroundImages.Default;
    document.body.style.backgroundImage = bg;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
}


// 🕓 Hourly forecast (6 items)
function updateHourlyForecast(data) {
    data.forEach((hourData, index) => {
        const date = new Date(hourData.dt * 1000);
        const hour = date.getHours();
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = `${hour % 12 || 12} ${ampm}`;

        document.querySelector(`#hour${index + 1} .day`).textContent = formattedHour;
        document.querySelector(`#temp${index + 1}`).textContent = `${Math.round(hourData.main.temp)}°C`;
        document.querySelector(`#cond${index + 1}`).textContent = hourData.weather[0].main;
    });
}

// 📅 Weekly forecast (daily summary from forecast list)
function updateWeeklyForecast(data) {
    const dailyMap = {};

    data.forEach(item => {
        const date = new Date(item.dt_txt).toDateString();
        if (!dailyMap[date]) dailyMap[date] = [];
        dailyMap[date].push(item);
    });

    const days = Object.keys(dailyMap).slice(0, 6);

    days.forEach((day, index) => {
        const avgTemp = dailyMap[day].reduce((sum, item) => sum + item.main.temp, 0) / dailyMap[day].length;
        const mainCondition = dailyMap[day][0].weather[0].main;
        const dayName = new Date(day).toLocaleDateString('en-US', { weekday: 'short' });

        const boxes = document.querySelectorAll(".sideBox .day-box");
        if (boxes[index]) {
            boxes[index].querySelector(".day").textContent = dayName;
            boxes[index].querySelector(".temp").textContent = `${Math.round(avgTemp)}°C`;
            boxes[index].querySelector(".condition").textContent = mainCondition;
        }
    });
}

// 🔍 Search button
document.querySelector("button").addEventListener("click", () => {
    const city = document.querySelector("input").value.trim();
    if (city) getWeather(city);
});

// ✅ On page load
window.onload = () => {
    updateTime();
    setInterval(updateTime, 1000);
    getWeather("Patti"); // default city
};


