import React from "react";
import "./index.scss";
import Weather from "./Weather";
// import Counter from "./Counter";

function convertToFlag(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

// async function getWeather(location) {}

class ClassyWeather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "Egypt",
            isLoading: false,
            displayLoaction: "",
            weather: {},
            Error: "",
        };
        this.fetchWeather = this.fetchWeather.bind(this);
    }

    async fetchWeather() {
        try {
            this.setState({ isLoading: true });
            // 1) Getting location (geocoding)
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
            );
            console.log(geoRes);
            // if (!geoRes.results) throw new Error("Location not found1");
            // if (!geoRes.ok) this.setState({ Error: "Location not found1" });
            // if (!geoRes.ok) throw new Error("Location not found1");

            const geoData = await geoRes.json();
            console.log(geoData);
            if (!geoData.results) throw new Error("Location not found");

            const { latitude, longitude, timezone, name, country_code } =
                geoData.results.at(0);
            // console.log(`${name} ${convertToFlag(country_code)}`);
            this.setState({
                displayLoaction: `${name} ${convertToFlag(country_code)}`,
            });

            // 2) Getting actual weather
            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
            );
            const weatherData = await weatherRes.json();
            // console.log(weatherData.daily);
            this.setState({ weather: weatherData.daily });
        } catch (error) {
            // this.setState({ Error: error });
            // this.setState({ Error: error.message });
            console.err(error);
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <>
                {/* <Counter /> */}
                <div className="app">
                    <h1>Classy weather</h1>

                    <div>
                        <input
                            type="text"
                            placeholder="search from location..."
                            value={this.state.location}
                            onChange={(e) =>
                                this.setState({ location: e.target.value })
                            }
                        />
                    </div>

                    <button onClick={this.fetchWeather}>Get weather</button>

                    {this.state.isLoading && (
                        <p className="loader">Loading...</p>
                    )}
                    {this.state.Error}

                    {this.state.weather.weathercode && (
                        <Weather
                            weather={this.state.weather}
                            location={this.state.displayLoaction}
                        />
                    )}
                </div>
            </>
        );
    }
}

export default ClassyWeather;
