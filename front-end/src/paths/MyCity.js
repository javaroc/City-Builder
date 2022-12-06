import { useState, useEffect } from 'react';
import React from "react";
import axios from 'axios';
/* global axios */


function City() {
  const [name, setName] = useState("Name me");
  const [money, setMoney] = useState(0);
  const [unemployed, setUnemployed] = useState(0);
  const [factoryCount, setFactoryCount] = useState(0);
  const [houseCount, setHouseCount] = useState(0);
  
  const fetchGameState = async() => {
    try {      
      console.log("Fetching state,");
      const response = await axios.get("/citybuilder/gamestate");
      console.log(response.data);
      setName(response.data.cityName);
      setMoney(response.data.money);
      setUnemployed(response.data.unemployed);
      setFactoryCount(response.data.buildingCounts.factoryCount);
      setHouseCount(response.data.buildingCounts.houseCount);
    } catch(error) {
      console.log("error retrieving tasks: " + error);
    }
  };
  
  const changeName = async(event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/citybuilder/name/" + name);
      setName(response.data.cityName);
    } catch(error) {
      console.log("error changing name: " + error);
    }
    
  };
  
  const advanceStep = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/citybuilder/nextday");
      fetchGameState();
    } catch (error) {
      console.log("error advancing step: " + error);
    }
  };
  
  const buildFactory = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/citybuilder/build/factory");
      fetchGameState();
    } catch (error) {
      console.log("error building factory: " + error);
    }
  };
  
  const buildHouse = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/citybuilder/build/house");
      fetchGameState();
    } catch (error) {
      console.log("error building house: " + error);
    }
  };
  
  const endGame = (event) => {
    //TODO request to server
  };
  
  
  useEffect(() => {
    fetchGameState();
  }, []);
  
  
  return (
    <div className='content'>
      <div className='game-window'>
        <h2>City Builder</h2>
        <div className="current-game">
          <form onSubmit={changeName}>
            <div>
              <label>
                Name:
                <input type="text" value={name}
                  onChange={e => setName(e.target.value)} />
              </label>
            </div>
            <input type="submit" value="Submit" />
          </form>
          <hr/>
          <div className="buildings-and-money">
            <div className="buildings">
              <p>BUILDINGS:</p>
              <div className="building-row">
                <p>factories: {factoryCount}</p>
              </div>
              <div className="building-row">
                <p>houses: {houseCount}</p>
              </div>
            </div>
            <div className="money">
              <p>MONEY: {money} coins</p>
              <p>UNEMPLOYED POPULATION: {unemployed} people</p>  
            </div>
          </div>
          <div className="build">
            <button onClick={buildFactory}>Build factory</button>
            <button onClick={buildHouse}>Build house</button>
          </div>
        </div>
      </div>
      <div className='footer-buttons'>
        <button onClick={advanceStep}>Next day</button>
        <button onClick={endGame}>End game</button>
      </div>
      <footer>
      <p>Site made by Zach Hacking and Alyssa Rogers</p>
      </footer>
    </div>
  )
}

export default City;