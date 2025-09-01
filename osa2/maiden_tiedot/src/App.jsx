import { useState, useEffect } from 'react'
import countryService from './services/countries'


function App() {
  const [countryNames, setCountryNames] = useState([])
  const [filter, setFilter] = useState('')
  const filteredCountryNames = countryNames.filter(countryName =>
    countryName.toLowerCase().includes(filter.toLowerCase())
  )
  const [showCountry,setShowCountry] = useState(null)
 

  useEffect(() => {
    console.log('effect')
    countryService.getAllCountryNames().then(names => {
      setCountryNames(names)
    })
  }, [])


  const handleFilter = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
    setShowCountry(null)
  }
  

  return (
    <div>
      <Filter filter={filter} handleFilter={handleFilter} />
      <FilteredCountryList 
        filteredCountryNames={filteredCountryNames}
        showCountry={showCountry}
        setShowCountry={setShowCountry}
        />
    </div>
  )
}

const Filter = ({ filter, handleFilter}) => {
  return (
    <div>
        find countries
      <input 
        value={filter}
        onChange={handleFilter}
      />
      </div>
  )
}

const FilteredCountryList = ( {filteredCountryNames, showCountry, setShowCountry} ) => {
  if (showCountry) {
    return (<CountryBasicData countryName={showCountry} />)
  }
  if (filteredCountryNames.length > 10) {
    return ('Too many matches, specify another filter')
  }
  if (filteredCountryNames.length > 1 && filteredCountryNames.length < 11) {
    return (
      filteredCountryNames.map(countryName =>
        <p key={countryName}>{countryName} <button onClick={() => setShowCountry(countryName)}>Show</button></p>
       )
    )
  }
  return (<CountryBasicData countryName={filteredCountryNames[0]} />)

}

const CountryBasicData = ({ countryName }) => {
  const [country, setCountry] = useState(null)

  if (!countryName) {
    return null
  }

  useEffect(() => {
    countryService
      .getCountryBasicData(countryName)
      .then(data => {
        setCountry(data)
      })
  }, [countryName])

  if (!country) {
    return null
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital} <br />
      Area {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png}></img>
      <h2>Weather in {country.capital}</h2>
      <CapitalWeather capital={country.capital} />
    </div>
  )
}

const CapitalWeather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService
      .getWeatherData(capital)
      .then(data => {
        setWeather(data)
      })
  }, [capital])

  if (!weather) {
    return null
  }

  return (
    <div>
      <p>Temperature {weather.main.temp} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
      <p>Wind {weather.wind.speed} m/s</p>
     </div>
  )
}





export default App
