/**
 * Define Global Variables
 * 
*/
// Open Weather API Base URL
const baseURL = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "bc1d6de3f036944cf94c6a01d4802902";

/*
Integrating with Weather API 
Example Call: api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key} 
*/
const fetchWeatherData = async (city) => {
    const url = baseURL + "?q=" + city + "&appid=" + apiKey + "&units=metric";
    const request = await fetch(url);

    try {
        // Transform into JSON
        const allData = await request.json();
        const temp = allData.main.temp;
        return temp;
    }
    catch (error) {
        console.log("error", error);
    }
}

/* asynchronous function to fetch the data 
from the app endpoint on server side
*/
const retrieveData = async (url = '') => {
    const request = await fetch(url);
    try {
        // Transform into JSON
        const allData = await request.json();
        return allData;
    }
    catch (error) {
        console.log("error", error);
    }
};

/* asynchronous function to post the data from the app to server side
*/
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),    
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
};

/* Fetch existing entries from server side and update UI */
function populateListFromServer() {
    console.log("Action");
    retrieveData('/all')
        .then(function (data) {
            const listArea = document.getElementsByClassName("list-area")[0];
            //Remove former content
            listArea.innerHTML = '';
            for (const entry of data) {
                const newBox = document.createElement("div");
                newBox.classList.add("card");
                const content = document.createElement("div");
                content.innerHTML = `
                <div id="date"> ${entry.date} </div>
                <div id="temp"> ${entry.temp} °C </div>
                <div id="content"> ${entry.city} </div>
                <div id="content"> ${entry.content} </div>`
                newBox.appendChild(content);
                listArea.appendChild(newBox);
            }
        })
}

/* Save user data to server and update latest entry UI */
function fetchSave() {
    const userInput = document.getElementById('zip').value;
    fetchWeatherData(userInput)

        .then(function (temp) {
            const today = new Date();
            let niceDate = `${today.getDate()}. ${String(today.getMonth() + 1)}. ${today.getFullYear()}`;
            const feelings = document.getElementById('feelings').value;
            const newEntry = {
                city: userInput,
                date: niceDate,
                temp: temp,
                content: feelings
            }
            //Update UI
            document.getElementById('city').innerHTML = "Location: " + userInput;
            document.getElementById('date').innerHTML = "Date: " + niceDate;
            document.getElementById('temp').innerHTML = "Temperature: " + temp + "°C";
            document.getElementById('content').innerHTML = feelings;

            const savedData = postData('/entry', newEntry)
                .then(function (savedData) {
                    console.log("Your entry was successfully saved");
                })
        })
}

//Listeners
document.getElementById('generate').addEventListener('click', fetchSave);
document.getElementById('fetch').addEventListener('click', populateListFromServer);
