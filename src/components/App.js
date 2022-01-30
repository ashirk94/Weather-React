import React, { Component } from "react";
import "./App.css";
import ZipForm from "./ZipForm";
import WeatherList from "./WeatherList";
import CurrentDay from "./CurrentDay";
import { get } from "axios";

//main component
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipcode: "",
      city: {},
      forecast: [],
      selectedDate: null,
    };
    this.url = "https://api.openweathermap.org/data/2.5/onecall?";
    this.apikey =
      "&exclude=minutely,hourly,current&units=imperial&appid=a243c5663029f159eef902fb93fa0112";
    this.googleKey = "AIzaSyDL9MZIX2qdnkRvQ-jAUJXK1kdheglNGTE";

    // url pattern for api call
    this.geocodeUrl =
      "https://maps.googleapis.com/maps/api/geocode/json?region=us&address=";

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onDayClicked = this.onDayClicked.bind(this);
  }
  render() {
    const { forecast, timezoneOffset, selectedDate, city } = this.state;
    return (
      <div id="app-container">
        <div className="app">
          <ZipForm onSubmit={this.onFormSubmit} />
          <WeatherList
            forecastDays={forecast}
            timezoneOffset={timezoneOffset}
            onDayClicked={this.onDayClicked}
          />
          {selectedDate !== null && (
            <CurrentDay
              forecastDay={forecast[selectedDate]}
              city={city}
              timezoneOffset={timezoneOffset}
            />
          )}
        </div>
      </div>
    );
  }
  //made api calls async to account for retrieval time
  async onFormSubmit(zipcode) {
    //google maps api call
    await get(`${this.geocodeUrl}${zipcode}&key=${this.googleKey}`)
      .then(({ data }) => {
        console.log(data);
        let curCity = {
          name: data.results[0].address_components[1].long_name,
          lat: data.results[0].geometry.location.lat,
          lon: data.results[0].geometry.location.lng,
        };
        this.setState({ city: curCity });
      })
      .catch((error) => {
        alert(error);
      });
    //weather api call
    await get(
      `${this.url}lat=${this.state.city.lat}&lon=${this.state.city.lon}${this.apikey}`
    )
      .then(({ data }) => {
        console.log(data);
        data.daily.splice(7);
        this.setState({
          forecast: data.daily,
          timezoneOffset: data.timezone_offset,
        });
      })
      .catch((error) => {
        alert(error);
      });
  }
  onDayClicked(dayIndex) {
    this.setState({ selectedDate: dayIndex });
  }
}

export default App;
