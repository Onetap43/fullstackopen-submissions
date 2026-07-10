import { useState, useEffect } from "react";
import axios from "axios";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => setCountries(response.data));
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  const countryToShow =
    selectedCountry ||
    (filteredCountries.length === 1 ? filteredCountries[0] : null);

  useEffect(() => {
    if (!countryToShow) return;

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${countryToShow.capital[0]}&appid=${apiKey}&units=metric`
      )
      .then(response => setWeather(response.data))
      .catch(() => setWeather(null));
  }, [countryToShow]);

  return (
    <div>
      <div>
        find countries{" "}
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedCountry(null);
          }}
        />
      </div>

      {filteredCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {filteredCountries.length > 1 &&
        filteredCountries.length <= 10 &&
        filteredCountries.map(country => (
          <div key={country.cca3}>
            {country.name.common}
            <button onClick={() => setSelectedCountry(country)}>
              show
            </button>
          </div>
        ))}

      {countryToShow && (
        <div>
          <h1>{countryToShow.name.common}</h1>

          <p>Capital {countryToShow.capital[0]}</p>
          <p>Area {countryToShow.area}</p>

          <h2>Languages</h2>

          <ul>
            {Object.values(countryToShow.languages).map(language => (
              <li key={language}>{language}</li>
            ))}
          </ul>

          <img
            src={countryToShow.flags.png}
            alt="flag"
            width="200"
          />

          {weather && (
            <>
              <h2>Weather in {countryToShow.capital[0]}</h2>

              <p>Temperature {weather.main.temp} °C</p>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather"
              />

              <p>Wind {weather.wind.speed} m/s</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;