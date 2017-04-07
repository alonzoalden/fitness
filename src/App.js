import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import moment from 'moment';
import LineChart from './components/LineChart.js'
import BikeMap from './components/BikeMap.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
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
      return !response
        ? 'Error retrieving data from Strava API'
        : response;
    })
    .then((response) => {
      let datesArray = this.createDatesArray();
      let formattedData = this.sortFitness(response, datesArray);
      let formattedDataFitnessLine = this.createFitnessLine(formattedData);
      formattedDataFitnessLine.forEach((d) => {
          d.formattedDate = new Date(d.formattedDate);
          d.kilojoules = !d.kilojoules || d.kilojoules === undefined
            ?  0
            : d.kilojoules;
        });
      return formattedDataFitnessLine;
    })
    .then((response) => {
      console.log(response)
      this.setState({
        data: response,
      })
    });
  }

  //this returns an array with all the dates from 180 days ago to today

  createDatesArray() {
    let timeAgoISO = moment().utc().subtract(180, 'days').format();
    let date1 = new Date();
    let date2 = new Date(timeAgoISO);
    let day;
    let datesBetween = [];

    while(date2 < date1) {
      let formattedDate = date1.toString().split('').slice(4, 15).join('');
      datesBetween.push({
        formattedDate: formattedDate,
        fitLine: 0,
        kilojoules: 0,
      });
      day = date1.getDate()
      date1 = new Date(date1.setDate(--day));
    }

    return datesBetween.reverse();
  }

  //this sorts each index of the response data to the relative date index on the dates array
  sortFitness(response, dates) {
    let startJ = 1;
    for (var i = 0; i < response.data.length; i++) {
      let currentRide = response.data[i];
      let currentKj = response.data[i].kilojoules;
      let d = response.data[i].start_date_local.slice(0,10)+'T07:00:00Z';
      let currentRideDate = new Date(d).toString().slice(4,15);

      for (var j = startJ-1; j < dates.length; j++) {
        let currentDate = dates[j].formattedDate;
        if (currentRideDate === currentDate) {
          currentRide.formattedDate = currentRideDate;
          dates[j] = currentRide;
          dates[j].kilojoules = currentKj;
          break;
        }
        ++startJ;
      }
    }
    return dates;
  }

  createFitnessLine(data) {
    let total = 0;
    let consecutiveZero = 0;

    for (var i = 0; i < data.length; i++) {
      let kj = data[i].kilojoules;
      kj === 0
        ? consecutiveZero += 1
        : consecutiveZero = 0;

      if (kj > 0) {
        total += total < 100
          ? (kj / 500)
          : (kj / 400);

      } else {
        total -= total > 0
          ? total - (0.90 * total)
          : 0;
      }
      data[i].fitnessLine = total;
    }
    return data;
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
          Information based off Strava records.
        </p>
        <div id="graph">
          <LineChart
            data={this.state.data}
          />
        </div>



      </div>
    );
  }
}

export default App;
