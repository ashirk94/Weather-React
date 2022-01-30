import React, { Component } from "react";
import { getDate, getWeekday } from "../utilities/dates";

class CurrentDay extends Component 
{
    constructor(props)
    {
        super(props);
        this.state = {};
    }
    render()
    {
            const { city, forecastDay: day, timezoneOffset } = this.props;
            const date = getDate(day.dt, timezoneOffset);
            const weekday = getWeekday(date);

            return (
              <div className="current-day">
                <h1 className="day-header">
                  {weekday} in {city.name}
                </h1>
                <div className="weather">
                  <p>
                    <img
                      src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`}
                      alt={day.weather[0].description}
                    />
                    {day.weather[0].description}
                  </p>
                </div>
                <div className="details flex-parent">
                  <div className="temperature-breakdown">
                    <p>Morning Temperature: {day.temp.morn}&deg;F</p>
                    <p>Day Temperature: {day.temp.day}&deg;F</p>
                    <p>Evening Temperature: {day.temp.eve}&deg;F</p>
                    <p>Night Temperature: {day.temp.night}&deg;F</p>
                  </div>
                  <div className="misc-details">
                    <p>Atmospheric Pressure: {day.pressure} hPa</p>
                    <p>Humidity: {day.humidity}%</p>
                    <p>Wind Speed: {day.wind_speed} mph</p>
                  </div>
                </div>
              </div>
            );
    }
}

export default CurrentDay;