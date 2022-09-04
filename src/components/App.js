import React, { Component } from 'react'
import './App.css'
import ZipForm from './ZipForm'
import WeatherList from './WeatherList'
import CurrentDay from './CurrentDay'
import { get } from 'axios'

//main component
class App extends Component {
	constructor() {
		super()
		this.state = {
			zipcode: '',
			city: {},
			forecast: [],
			selectedDate: null,
            init: false
		}
		this.url = 'https://api.openweathermap.org/data/2.5/onecall?'
		this.apikey =
			'&exclude=minutely,hourly,current&units=imperial&appid=' +
			process.env.REACT_APP_WEATHER_API_KEY

		this.googleKey = process.env.REACT_APP_GOOGLE_API_KEY

		// url pattern for api call
		this.geocodeUrl =
			'https://maps.googleapis.com/maps/api/geocode/json?address='

		this.onFormSubmit = this.onFormSubmit.bind(this)
		this.onDayClicked = this.onDayClicked.bind(this)
	}
	render() {
		const { forecast, timezoneOffset, selectedDate, city } = this.state
		return (
			<div id='app-container'>
                <ZipForm onSubmit={this.onFormSubmit} />
				<div className='app'>
                <div className='city-container'>
					{selectedDate !== null && (
						<CurrentDay
							forecastDay={forecast[selectedDate]}
							city={city}
							timezoneOffset={timezoneOffset}
						/>
					)}
                    {(this.state.init && selectedDate == null && Object.keys(city).length > 0) && (
                        <div className='city'>
                            <h2>Weekly forecast for :</h2>
                            <h1>{city.name}</h1>
                            <h2>Click on a day to see daily forecast</h2>
                        </div>
                    )}
                    </div>
                    <div className='day-container'>
					{this.state.init && (
                        <WeatherList
						forecastDays={forecast}
						timezoneOffset={timezoneOffset}
						onDayClicked={this.onDayClicked}
					/>
                    )}				
                    </div>               
				</div>
			</div>
		)
	}
	//made api calls async to account for retrieval time
	onFormSubmit(zipcode) {
        this.setState({ init: false })
		//google maps api call
		get(`${this.geocodeUrl + zipcode}&key=${this.googleKey}`)
			.then(({ data }) => {
				let curCity = {
					name: data.results[0].address_components[1].long_name,
					lat: data.results[0].geometry.location.lat,
					lon: data.results[0].geometry.location.lng
				}
				this.setState({city: curCity})

				//weather api call
				get(
					`${this.url}lat=${this.state.city.lat}&lon=${this.state.city.lon}${this.apikey}`
				)
					.then(({ data }) => {
						data.daily.splice(7)
						this.setState({
							forecast: data.daily,
							timezoneOffset: data.timezone_offset
						})
                        this.setState({ init: true })
					})
					.catch((error) => {
						alert(error)
						console.log(error)
                        this.setState({ init: false })
					})
			})
			.catch((error) => {
				alert('Invalid Zipcode/Address')
				console.log(error)
                this.setState({ init: false })
			})
            this.setState({ selectedDate: null })
	}
	onDayClicked(dayIndex) {
		this.setState({ selectedDate: dayIndex })
	}
}

export default App
