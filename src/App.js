import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import moment from 'moment';
// import LineChart from './components/LineChart.js'
// import FitnessChart from './components/FitnessChart.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formattedData: [],
      data: [],
      dates: [],
    }
  }

  authorize() {
    var yearAgoISO = moment().utc().subtract(180, 'days');
    var yearAgoEpoch = yearAgoISO.unix();

    axios.get('https://www.strava.com/api/v3/athlete/activities', {
      params: {
        access_token: 'e6f5be775faf79655e23c8d71dd059fbdc7bdb96',
        per_page: 180,
        after: yearAgoEpoch
      }
    })
    .then((response) => {
      return !response ? 'Error retrieving data from Strava API' : response;
    })
    .then((response) => {
      this.createDatesArray();
      return response;
    })
    .then((response) => {
      let fitnessData = this.sortFitness(response);
      this.setState({
        data: fitnessData,
      })
    })
  }

  //this returns an array with all the dates from 180 days ago to today
  createDatesArray() {
    let timeAgoISO = moment().utc().subtract(179, 'days').format();
    let date1 = new Date();
    let date2 = new Date(timeAgoISO);
    let day;
    let datesBetween = [];

    while(date2 < date1) {
        let formattedDate = date1.toString().split('').slice(4, 15).join('');

        datesBetween.push({
          formattedDate: formattedDate,
          fitLine: 0,
        });

        day = date1.getDate()
        date1 = new Date(date1.setDate(--day));
    }
    this.setState({
      formattedData: datesBetween.reverse(),
    })
    console.log(this.state)
  }

  //this sorts each index of the response data to the relative date index on the dates array
  sortFitness(response) {
    let startJ = 1;
    for (var i = 0; i < response.data.length; i++) {
      let currentRide = response.data[i];
      let d = response.data[i].start_date_local.slice(0,10)+'T07:00:00Z';
      let currentRideDate = new Date(d).toString().slice(4,15);

      for (var j = startJ-1; j < this.state.formattedData.length; j++) {
        let currentDate = this.state.formattedData[j].formattedDate;
        if (currentRideDate === currentDate) {
          currentRide.formattedDate = currentRideDate;
          this.state.formattedData[j] = currentRide;
          break;
        }
        ++startJ;
      }
    }
  }

  createFitnessLine(data) {
    let total = 0;
    //get kj / 500 for current fitness
    //first 0 is - .5, after its -1
    //add fitnessLine property to data item with corresponding current total

    for (var i = 0; i < data.length; i++) {
      total += total < 5000 ? (data[i].kilojoules / 500) : (data[i].kilojoules / 420);

    }
  }

  sortFitnessOld(response) {
    var timeAgoISO = moment().utc().subtract(180, 'days');
    var yearAgoEpoch = timeAgoISO.unix();
    var timeAgo = moment(timeAgoISO);
    var lastDate = null;
    var rides = [];

    for (var i = 0; i < response.data.length; i++) {
      var currentDate = moment(response.data[i].start_date_local);
      var dateDiff = !lastDate ? currentDate.from(timeAgoISO) : currentDate.from(lastDate);
      var daysBetween = 0;
      var timeInWords = dateDiff.split(" ");

      if (timeInWords[2] === 'days') {
        daysBetween = Number(timeInWords[1] - 1);
        while (daysBetween !== 0) {
          rides.push(0);
          daysBetween--;
        }
      } else if (timeInWords[2] === 'month') {
        var lastDateDIM = moment(lastDate).daysInMonth();
        var lastDateNum = lastDate.toString().split('').slice(8, 10).join('');
        var firstHalf = lastDateDIM - Number(lastDateNum);
        var secondHalf = currentDate.toString().split('').slice(8, 10).join('');
        daysBetween = firstHalf + Number(secondHalf);

        while (daysBetween !== 0) {
          rides.push(0);
          daysBetween--;
        }
      } else if (timeInWords[2] === 'months') {
        daysBetween = timeInWords[1] * 30;
        while (daysBetween !== 0) {
          rides.push(0);
          daysBetween--;
        }
      }

      if (timeInWords[2] === 'hours') {
        if (Number(timeInWords[1]) < 14 && i !== 0) {
          continue;
        }
      }
      rides.push(response.data[i]);
      lastDate = currentDate;
    }
    if (rides.length < this.state.dates.length) {
      while (rides.length < this.state.dates.length) {
        rides.unshift(0);
      }
    }

    return rides;
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
        <div id="graph">

        </div>
      </div>
    );
  }
}

export default App;
