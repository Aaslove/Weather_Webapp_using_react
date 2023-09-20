import React, { useEffect, useState } from "react";
import { images } from "./ArrayOfImage";
import "./WeatherStyle.css";

function WeatherDeatail() {
  const [cityname, setCityname] = React.useState("Delhi");
  const [data, setData] = React.useState("");
  const [fetchedData, setFetchedData] = useState({});

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=57dc2c9ceff3366933bac0394afa3002`;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setFetchedData(result);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [cityname]);

  const handleChange = (e) => {
    e.preventDefault();
    setData(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCityname(data);
  };

  const getCurrentDateTime = () => {
    const date = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleString(undefined, options);
  };

  const [currentTime, setCurrentTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentDateTime());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const [imgUrl, setImgUrl] = useState(
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  );

  useEffect(() => {
    if (fetchedData.weather) {
      images.forEach((image) => {
        if (fetchedData.weather[0]?.main === image.title) {
          setImgUrl(image.url);
        }
      });
    }
  }, [fetchedData.weather]);

  return (
    <>
      <div className="Container" style={{ backgroundImage: `url(${imgUrl})` }}>
        <div className="image-box">
          <div>
            <p className="img-text">
              {(fetchedData.main?.temp - 273 || 0).toFixed(0)}°C
            </p>
            <p className="img-text2">
              {fetchedData.name}, {fetchedData.sys?.country}
            </p>
            <p className="img-text3">{currentTime}</p>
          </div>
          {fetchedData.weather && (
            <div className="icon-wrap">
              <img
                src={`https://openweathermap.org/img/w/${fetchedData.weather[0].icon}.png`}
                alt="Weather Icon"
                className="weather-icon"
              />
              <p className="card-title">{fetchedData.weather[0].description}</p>
            </div>
          )}
        </div>
        <div className="text-box">
          <div className="searching">
            <form onSubmit={handleSubmit}>
              <input
                type="search"
                className="searchbox"
                onChange={handleChange}
                placeholder="Enter the city"
              />
              <button>
                <i class="fa fa-search icon" aria-hidden="true"></i>
              </button>
            </form>
          </div>

          {fetchedData.weather && (
            <div className="details">
              <div className="list">
                <ul className="list-group">
                  <li className="list-item">
                    Humidity : {fetchedData.main?.humidity}%
                  </li>
                  {fetchedData.visibility && (
                    <li className="list-item">
                      Visibility : {fetchedData.visibility}mi
                    </li>
                  )}
                  {fetchedData.wind && (
                    <li className="list-item">
                      Wind Speed : {fetchedData.wind.speed}km/h
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default WeatherDeatail;
