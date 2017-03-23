import React, { Component } from 'react';
import './App.css';
// import FitnessChart from './components/FitnessChart.js';
import axios from 'axios';
import moment from 'moment';
// import LineChart from './components/LineChart.js'

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
    console.log(this.state)
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
      let fitnessData = this.sortFitnessNew(response);
      this.setState({
        data: fitnessData,
      })
      console.log(this.state)
    })
  }

  sortFitnessNew(response) {

    for (var i = 0; i < response.data.length; i++) {
      let startI = 1;
      let currentRide = response.data[i];
      var d = response.data[i].start_date_local.slice(0,10)+'T07:00:00Z';
      let currentRideDate = new Date(d).toString().slice(4,15);
      for (var j = startI-1; j < this.state.formattedData.length; j++) {
        let currentDate = this.state.formattedData[j].formattedDate;
        console.log(currentRideDate, currentDate)

        if (currentRideDate === currentDate) {
          currentRide.formattedDate = currentRideDate;
          this.state.formattedData[j] = currentRide;
          console.log(this.state.formattedData)
        }
        ++startI
      }
      startI = 0
    }
    //create for loop, for each response.data
      //create another for loop for dates
      //iterate thru the whole dates array
        //do a match of start_date_local and dates.formattedDate
          //if true
            // extend this formattedDate on to (data[i].formattedDate = dates[i].formattedDate)
            //iMemory = i - 1
  }

  //new idea for sortFitness
  //create helper method called days between. takes 2 date args, calc daysbetween, then adds objects with start_date property of the corresponding date iterated as many times from the amount calced from n daysbetween

  //use moment to find the date of 180 days ago.
  //make comparison of first date 180 days ago to first ride date.
  //make comparison for each day in between

  //should return an array, all objects should have the corresponding date

  // sortFitnessNew(response) {
  //   let startDate = moment().utc().subtract(180, 'days')
  //   let rideData = [];
  //   let lastDate = null;

  //   const timeBetween = (startDate, endDate) => {
  //     let startDateStr = new Date(startDate).toString().split('').slice(0, 15).join('');
  //     let endDateStr = new Date(endDate).toString().split('').slice(0, 15).join('');
  //     let date1 = new Date(startDateStr);
  //     let date2 = new Date(endDateStr);
  //       console.log(date1)
  //       console.log(date2)
  //     let dayCount = Math.ceil(((date2 - date1) / 3600000) / 24);
  //     let day;
  //       console.log(dayCount)
  //     while(dayCount > 1) {
  //         dayCount--

  //         day = date1.getDate();
  //         date1 = new Date(date1.setDate(day+=1));
  //         console.log("this should be +1 day after the startdate/lastdate", new Date(date1))
  //         var formattedDate = date1.toString().split('').slice(0, 15).join('');

  //         rideData.push({ start_date_new: formattedDate });
  //     }

  //     lastDate = date2.toString().split('').slice(0, 15).join('');

  //   }

  //     for (let i = 0; i < response.data.length; i++) {
  //       let currentTimeData = response.data[i].start_date_local.slice(0,10);

  //       !lastDate ? timeBetween(startDate, currentTimeData) : timeBetween(lastDate, currentTimeData);
  //       // response.data[i].start_date_new = lastDate;
  //       rideData.push(response.data[i]);
  //     }



  //     //take lastDate and currentDate
  //     //iterate with a while loop until it get's there
  //       //for all iterations, add to the array, an object of the current iteration's date with property called start_time_local


  //   return rideData;
  // }


  sortFitness(response) {
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
        datesBetween.push({ formattedDate : formattedDate });
    }


    this.setState({
      formattedData: datesBetween
    })
    console.log(this.state.formattedData)
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
