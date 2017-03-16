import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }

  authorize() {
    var yearAgoEpoch = moment().utc().subtract(365, 'days').unix();

    axios.get('https://www.strava.com/api/v3/athlete/activities', {
      params: {
        access_token: "e6f5be775faf79655e23c8d71dd059fbdc7bdb96",
        per_page: 10,
        before: yearAgoEpoch
      }
    })
      .then((response) => {
        return !response ? 'Error retrieving data from Strava API' : response;
      })
      .then((response) => {
        console.log(response.data)
        //write algorithm that does a check for the last ride from the current ride using momentjs. for each amount of days in between each ride, push that many 0's into the array. these will represent off days where fitness will drop.

        //if total fitness <20, multiply by 3
        // < 40 multiply by 2
        // < 60 multiply by 1

        //i.e. tapers off over time.
      })
  }

  componentDidMount() {
    this.authorize();
  }



  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Fitness</h2>
        </div>
        <p className="App-intro">
          Strava based fitness checker.
        </p>
      </div>
    );
  }
}

export default App;
