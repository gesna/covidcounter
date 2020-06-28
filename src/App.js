import React from 'react';
import { PrimaryButton, TextField } from '@fluentui/react'
import { List } from 'office-ui-fabric-react/lib/List';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import { VictoryChart, VictoryTheme, VictoryArea } from "victory";
import './App.css';
import moment from 'moment';
import { useTable } from 'react-table';
const axios = require('axios');


export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      view: ""
    }

  }
  componentDidMount() {
    this.setState({ view: "Landing" })
  }
  gotologin() {
    this.setState({ view: "Login" })
  }
  gotolanding() {
    this.setState({ view: "Landing" })
  }
  loginclick() {
    this.setState({ view: "Store" })
  }
  createaccountclick() {
    this.setState({ view: "CreateAccount" })
  }
  gotocustomer() {
    this.setState({ view: "Shopper" })
  }
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          {this.state.view === "Landing" ? <Landing gotocustomer={() => this.gotocustomer()} gotologin={() => this.gotologin()} /> : <div></div>}
          {this.state.view === "Login" ? <Login loginclick={() => this.loginclick()} createaccountclick={() => this.createaccountclick()} gotolanding={() => this.gotolanding()} /> : <div></div>}
          {this.state.view === "Store" ? <Store gotolanding={() => this.gotolanding()} /> : <div></div>}
          {this.state.view === "CreateAccount" ? <CreateAccount gotologin={() => this.gotologin()} loginclick={() => this.gotologin()} createaccountclick={() => this.createaccountclick()} gotolanding={() => this.gotolanding()} /> : <div></div>}
          {this.state.view === "Shopper" ? <Shopper gotolanding={() => this.gotolanding()} /> : <div />}


          {/* <Route exact path="/store">
              <Store/>
            </Route>
            <Route exact path="/shopper">
              <Shopper/>
            </Route> */}
        </BrowserRouter>
      </div>
    );
  };
}
class Login extends React.Component {

  render() {
    return (
      <div>
        <br />
        <br />

        <Link to="/"><PrimaryButton onClick={() => this.props.gotolanding()}>CovidCounter Home</PrimaryButton></Link>
        <h3>Login to existing account:</h3>

        <TextField placeholder="Username" />
        <br />

        <TextField placeholder="Password" type="password" />
        <br />

        <PrimaryButton onClick={() => this.props.loginclick()}>Login</PrimaryButton>
        <br />        <br />


        <PrimaryButton onClick={() => this.props.createaccountclick()}>Create a New Account</PrimaryButton>

      </div>
    )
  }
}
class CreateAccount extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: ""
    }
  }
  createaccountsubmit() {
    console.log("/createStore?storename=" + (this.state.name))
    axios.get("http://localhost:5000/createStore?storename=" + this.state.name.trim(), {}).catch(e => console.log(e))
    this.props.gotologin()
  }

  render() {
    return (
      <div>
        <br />
        <br />
        <Link to="/"><PrimaryButton onClick={() => this.props.gotolanding()}>CovidCounter Home</PrimaryButton></Link>
        <h3>Create an Account:</h3>
        <TextField placeholder="Username" />
        <br />
        <TextField placeholder="Password" type="password" />
        <br />
        <TextField placeholder="Business Name" onChange={(e) => this.setState({ name: e.target.value })} />
        <br />

        <PrimaryButton onClick={() => this.props.loginclick()}>Back to Login</PrimaryButton>
        <br />
        <br />

        <PrimaryButton onClick={() => this.createaccountsubmit()}>Create Account</PrimaryButton>
      </div>
    )
  }
}
class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>

        <h1> CovidCounter</h1>
        <p> As the global economy opens back up in response to a plateau in the number of new COVID-19 cases per day, it is crucial that our society takes all measures possible to avoid a second peak in the number of cases. One such measure that we've identified is ensuring that businesses have a means of communicating the maximum capacity and current capacity of their facilities to their customers in real time.
        Our COVID Capacity Counter app facilitates the delivery of this data for all interested organizations at no cost. By providing this service, we are empowering customers to schedule their visits to large facilities like grocery stores and restaurants during less populous times, and therefore, empowering the human race to help prevent the spread of the virus.
        </p>

        <h3>I am a</h3>
        <Link to="/store"><PrimaryButton onClick={() => this.props.gotologin()}>Store</PrimaryButton></Link>
        <br />
        <br />
        <Link to='/shopper'><PrimaryButton onClick={() => this.props.gotocustomer()}>Shopper</PrimaryButton></Link>

      </div>

    )
  }
}
class Store extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      maxCapacity: 0,
      currentOccupancy: 0,
      videoSource: '',
      pastOccupancy: [
        { time: '2PM', people: 43 },
        { time: '3PM', people: 56 },
        { time: '4PM', people: 48 },
        { time: '5PM', people: 52 },
        { time: '6PM', people: 78 },
        { time: '7PM', people: 81 },
      ],
      message: " ",
      showVideo: false
    };
  }


  componentDidMount() {
    // fetch("/stream")
    // .then(res => res.json())
    // .then((data) =>{
    //   this.setState({maxCapacity: data.maxCapacity, currentOccupancy: data.currentOccupancy})
    // })
    // .catch(this.setState({maxCapacity: 100, currentOccupancy: 83}))
    // fetch("/getCurrentOccupancy?storename=Walmart&address=420MicrosoftBlvdRedmondWA")
    // .then(res => res.json())
    // .then((data) => {
    //   console.log(data)
    //   this.setState({currentOccupancy: 69})
    // })
    this.setState({ maxCapacity: 100, currentOccupancy: 83 })
  };

  validate(ip) {
    return true;
  };

  updateVideoSource(e) {
    if (this.validate(e)) {
      this.setState({ videoSource: e.target.value });
      console.log("e")
      console.log(e.target.value)
    }
  };

  submitvideoip() {
    console.log(this.state.videoSource)
    this.setState({ message: "Processing video..." })
    setTimeout(() => this.setState({ message: "", showVideo: true }), 5000)

  }
  updatedata() {
    axios.get("http://localhost:5000/getCurrentOccupancy?storename=Walmart&address=420MicrosoftBlvdRedmondWA", {})
    .then(res => (res.data))
    .then(data => this.setState({
      currentOccupancy: data,
      pastOccupancy: [
        ...this.state.pastOccupancy,
        { time: '8PM', people: data },
      ]
    }))
    .catch(e => console.log(e))

  }

  render() {
    return (
      <div className="Store">
        <br /><br />
        <Link to="/"><PrimaryButton onClick={() => this.props.gotolanding()}>CovidCounter Home</PrimaryButton></Link>

        <span>
          <p>Link to Camera Video:</p>

          <TextField placeholder="eg. 127.0.0.1:4000" onChange={(e) => this.updateVideoSource(e)} />
          <br />
          <PrimaryButton onClick={() => this.submitvideoip()}>Update Video IP</PrimaryButton>
          <h3>{this.state.message}</h3>

          {this.state.showVideo === true ? <div><br />
            <br />
            <span>
              <iframe width="560" height="315" src="https://www.youtube.com/embed/FSUhn3CzjZU" frameBorder="0" allowFullScreen></iframe>
            </span></div> : <div />}
        </span>


        <div id='live-view'>

        </div>

        <div id='occupancy-chart'>
          <VictoryChart theme={VictoryTheme.Material}>
            <VictoryArea
              data={this.state.pastOccupancy}
              x="time"
              y="people"
            />
          </VictoryChart>
        </div>

        <span>
          <h3>Current Occupancy: </h3>
          <h3> {this.state.currentOccupancy} </h3>
        </span>
        <span>
          <PrimaryButton onClick={() => this.updatedata()}>Update Data</PrimaryButton>
        </span>

        <br />
      </div>
    );
  };
}

class Shopper extends React.Component{

  constructor(props){
    super(props);
    const time = moment().format('LTS');

    this.state = {
      maxCapacity: 0,
      currentOccupancy:50,
      videoSource: '',
      storeData: {
        'Walmart': Math.floor(50 + Math.random()*30),
        'Trader Joe\'s': Math.floor(50 + Math.random()*30),
        'Whole Foods': Math.floor(50 + Math.random()*30),
        'PetCo': Math.floor(50 + Math.random()*30)
      }
    };
  }

  mockdata(){
    var newStoreData = this.state.storeData;
    for (const store in newStoreData){
      newStoreData[store] = newStoreData[store] + Math.floor(Math.random() * 8 - 4);
    }
    this.setState({storeData: newStoreData}); 
  }


  componentDidMount() {
    setInterval(()=>this.mockdata(), 3000);
  }

  render(){
    return(
      <React.Fragment>
        <Link to="/"><PrimaryButton onClick={() => this.props.gotolanding()}>CovidCounter Home</PrimaryButton></Link>
        <h1> Shopper View</h1>
        <table>
          <tr> 
            <th>Store</th>
            <th>Occupancy</th>
          </tr>
          <tr>
            <td>Walmart</td>
            <td>{this.state.storeData['Walmart']}</td>
          </tr>
          <tr>
            <td>Trader Joe's</td>
            <td>{this.state.storeData['Trader Joe\'s']}</td>
          </tr>
          <tr>
            <td>Whole Foods</td>
            <td>{this.state.storeData['Whole Foods']}</td>
          </tr>
          <tr>
            <td>PetCo</td>
            <td>{this.state.storeData['PetCo']}</td>
          </tr>
        </table>
      </React.Fragment>
    );
  };
}

