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
    var yearAgoISO = moment().utc().subtract(365, 'days');
    var yearAgoEpoch = yearAgoISO.unix();


    axios.get('https://www.strava.com/api/v3/athlete/activities', {
      params: {
        access_token: ACCESS_TOKEN,
        per_page: 100,
        after: yearAgoEpoch
      }
    })
      .then((response) => {
        return !response ? 'Error retrieving data from Strava API' : response;
      })
      .then((response) => {

        var yearAgo = moment(yearAgoISO);
        var rides = [];
        var lastDate = null;

        for (var i = 0; i < response.data.length; i++) {
          var currentDate = moment(response.data[i].start_date);
          var dateDiff = !lastDate ? currentDate.from(yearAgo) : currentDate.from(lastDate);
          var daysBetween = 0;
          var timeInWords = dateDiff.split(" ")
          if (timeInWords[2] === 'day') {
            rides.push(response.data[i])
          } else if (timeInWords[2] === 'days') {
            daysBetween = Number(timeInWords[1] - 1);
            while (daysBetween !== 0) {
              rides.push(0)
              daysBetween--
            }
          } else {
            rides.push(response.data[i])
          }
          lastDate = currentDate
        }
        console.log(rides)
        //start with a how long ago from one year




        //write algorithm that does a check for the last ride from the current ride using momentjs. for each amount of days in between each ride, push that many 0's into the array. these will represent off days where fitness will drop.

        //if total fitness <20, multiply by 3
        // < 40 multiply by 2
        // < 60 multiply by 1
        //i.e. tapers off over time.


      })
  }

  sortFitness(data) {

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
