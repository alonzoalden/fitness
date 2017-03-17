import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      console.log(response.data)
      return !response ? 'Error retrieving data from Strava API' : response;
    })
    .then((response) => {
      var fitnessData = this.sortFitness(response);
      this.setState({
        data: fitnessData
      })
      console.log(this.state)
    })
  }

  sortFitness(response) {
    var timeAgoISO = moment().utc().subtract(180, 'days');
    var yearAgoEpoch = timeAgoISO.unix();
    var timeAgo = moment(timeAgoISO);
    var lastDate = null;
    var rides = [];

    console.log('XXX', moment('2016-12-28T12:17:02Z').from('2017-01-24T11:48:00Z'))
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
        console.log(currentDate, daysBetween)

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
          console.log('ss')
          continue;
        }
      }
      rides.push(response.data[i].start_date_local);
      lastDate = currentDate;
    }
    if (rides.length < this.state.dates.length) {
      while (rides.length < this.state.dates.length) {
        rides.unshift(0);
      }
    }
    return rides;
  }

  createDatesArray() {
    var timeAgoISO = moment().utc().subtract(179, 'days').format();

    var date1 = new Date();
    var date2 = new Date(timeAgoISO);
    var day;
    var datesBetween = [date1.toString().split('').slice(4, 15).join('')];

    while(date2 < date1) {
        day = date1.getDate()
        date1 = new Date(date1.setDate(--day));
        var formattedDate = date1.toString().split('').slice(4, 15).join('');
        datesBetween.push(formattedDate);
    }

    this.setState({
      dates: datesBetween.reverse(),
    })
  }

  componentDidMount() {
    this.authorize();
    this.createDatesArray();
    console.log(this.state)
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
