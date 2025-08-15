import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

const getAllCountryNames = () => {
    return axios.get(`${baseUrl}/all`)
        .then(response => response.data.map(country => country.name.common))
}

const getCountryBasicData = (countryName) => {
  const request = axios.get(`${baseUrl}/name/${countryName}`)
  return request.then(response => response.data)
}

const getWeatherData = (countryCapital) => {
  const apiKey = import.meta.env.VITE_SOME_KEY
  const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${countryCapital}&units=metric&appid=${apiKey}`)
  return request.then(response => response.data)         
}

export default { getAllCountryNames, getCountryBasicData, getWeatherData}