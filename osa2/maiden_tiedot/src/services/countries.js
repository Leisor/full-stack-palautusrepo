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

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { getAllCountryNames, getCountryBasicData, create, update, remove }