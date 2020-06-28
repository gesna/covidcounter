import React from 'react';
import { PrimaryButton, TextField } from '@fluentui/react'
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { VictoryChart, VictoryTheme, VictoryArea } from "victory";
import './App.css';

export default class App extends React.Component {
  render(){
    return (
      <div className="App">
        <h1> CovidCounter</h1>
        <p> As the global economy opens back up in response to a plateau in the number of new COVID-19 cases per day, it is crucial that our society takes all measures possible to avoid a second peak in the number of cases. One such measure that we've identified is ensuring that businesses have a means of communicating the maximum capacity and current capacity of their facilities to their customers in real time.
          Our COVID Capacity Counter app facilitates the delivery of this data for all interested organizations at no cost. By providing this service, we are empowering customers to schedule their visits to large facilities like grocery stores and restaurants during less populous times, and therefore, empowering the human race to help prevent the spread of the virus.
        </p>

        <h3>I am a</h3>
        <BrowserRouter> 
          <Link to="/store"><PrimaryButton>Store</PrimaryButton></Link>
          <Link to='/shopper'><PrimaryButton>Shopper</PrimaryButton></Link>
          <Switch>
            <Route exact path="/store">
              <Store/>
            </Route>
            <Route exact path="/shopper">
              <Shopper/>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  };
}

class Store extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      maxCapacity: 0,
      currentOccupancy:0,
      videoSource: '',
      pastOccupancy: {
        '2PM': 43,
        '3PM': 56,
        '4PM': 48,
        '5PM': 52,
        '6PM': 78,
        '7PM': 81,
      }
    };
  }


  // componentDidMount(){
  //   fetch("/stream")
  //   .then(res => res.json())
  //   .then((data) =>{
  //     this.setState({maxCapacity: data.maxCapacity, currentOccupancy: data.currentOccupancy})
  //   })
  //   .catch(this.setState({maxCapacity: 100, currentOccupancy: 83}))
  // };

  validate(ip){
    return true;
  };

  updateVideoSource(ip){
    if (this.validate(ip)){
      this.setState({videoSource: ip});
    }
  };

  render() {
    return(
      <div className="Store">
        <h1> CovidCounter</h1>
        <span>
          <p> Camera IP: </p> 
          {/* <TextField placeholder="eg. 127.0.0.1:4000" onChange={this.updateVideoSource(this.value)}/> */}
        </span>

        <div id='live-view'>

        </div>

        <div id='occupancy-chart'>
          <VictoryChart theme={VictoryTheme.Material}>
            <VictoryArea
              data={this.state.pastOccupancy}
            />
          </VictoryChart>
        </div>

        <span>
          <h3>Current Occupancy: </h3> 
          <h3> {this.state.currentOccupancy} </h3>
        </span>

      </div>
    );
  };
}

class Shopper extends React.Component{
  render(){
    return(
      <h1> Shopper View</h1>
    )
  };
}