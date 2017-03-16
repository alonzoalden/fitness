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
        access_token: "e6f5be775faf79655e23c8d71dd059fbdc7bdb96",
        per_page: 10,
        after: yearAgoEpoch
      }
    })
      .then((response) => {
        return !response ? 'Error retrieving data from Strava API' : response;
      })
      .then((response) => {
        console.log(response)
        var b = moment(yearAgoISO)
        console.log('b', b.from(response.data[2].start_date))

        console.log(moment(response.data[1].start_date))
        console.log(response.data[2].start_date)
        var rides = [];


        for (var i = 0; i < response.data.length; i++) {
          rides.push(response.data[i])
          //set up holder to remember last date.
          //compare current date to last date
            //if it's 1 day,
              //rides.push(ride)
            //if its 2+ days
              //daysBetween = days - 1
              //set up while (daysBetween !== 0)
                //daysBetween---
                //rides.push(0)
              //rides.push(ride)

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
