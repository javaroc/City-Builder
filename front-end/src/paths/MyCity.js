import React from "react";


class City extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: 'Name Me', money: 0, population: 0, day: 0};
    this.advanceStep = this.advanceStep.bind(this);
    this.buildFactory = this.buildFactory.bind(this);
    this.buildHouse = this.buildHouse.bind(this);
    this.endGame = this.endGame.bind(this);
  }
  
  advanceStep(event) {
    this.setState({money: this.state.money + 100});
    this.setState({day: this.state.day + 1});
  }
  
  buildFactory(event) {
    this.setState({money: this.state.money - 500});
  }
  
  buildHouse(event) {
    this.setState({money: this.state.money - 200 });
    this.setState({population: this.state.population +5});
  }
  
  endGame(event) {
    //TODO request to server
  }
  
  
  
  render() {
    return (
    <div class='content'>
      <div class='game-window'>
        <h2>City Builder</h2>
        <div class="current-game">
          <h3>{this.state.name}</h3>
          <hr/>
          <div class="buildings-and-money">
            <div class="buildings">
              <p>BUILDINGS: </p>
            </div>
            <div class="money">
              <p>MONEY: {this.state.money} coins</p>
              <p>POPULATION: {this.state.population} people</p>  
            </div>
          </div>
          <div class="build">
            <button onClick={this.buildFactory}>Build factory</button>
            <button onClick={this.buildHouse}>Build house</button>
          </div>
        </div>
      </div>
      <div class='footer-buttons'>
        <button onClick={this.advanceStep}>Next day</button>
        <button onClick={this.endGame}>End game</button>
      </div>
      <footer>
      <p>Site made by Zach Hacking and Alyssa Rogers</p>
      </footer>
    </div>
  
    );
  }
}

export default City;