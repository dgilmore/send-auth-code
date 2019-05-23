import React, { Component } from 'react';
import axios from "axios";



class App extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToMatch: null,
    isAMatch: false,
    objectToUpdate: null,
    hasBeenSubmitted: false
  };

  componentDidMount() {
    this.getDataFromDb();
    if(!this.state.setInterval){
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval});
    }
  }

  componentWillUnmount(){
    if(!this.state.intervalIsSet) {
      clearInterval(this.state.intervalSet);
      this.setState({ intervalIsSet: null});
    }
  }

  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
     .then(data => data.json())
     .then(res => this.setState({data: res.data}));
  };

  putDataToDb = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    this.setState({ hasBeenSubmitted: true });
    while(currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }
     this.setState({ idToMatch: idToBeAdded })
     axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      message: message
    });
  };

  resetPage = () => {
    this.setState({ hasBeenSubmitted: false});
    this.setState({ isAMatch: false});
  };

  matchFromDb = codeToMatch => {
    let objIdToMatch = null;
    this.state.data.forEach(dat => {
      if (dat.code == codeToMatch) {
        this.setState({ isAMatch: true});
      }
    })
  };

  render() {
    const { data } = this.state;
    const { hasBeenSubmitted } = this.state;
    const { isAMatch } = this.state;
    return (
      <div>
      <ul>
       { hasBeenSubmitted == false
         ? "Get a code sent to your phone via SMS"
         :
         data.map(dat => (
           <li style={{ padding: "10px" }} key={data.message}>
                  <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                  <span style={{ color: "gray" }}> data: </span>
                  {dat.message} <br />
                  <span style={{ color: "gray" }}> code: </span> {dat.code}
                </li>
         ))}
         { isAMatch == false
           ? "Code not a match"
           : "Code Matches!"
         }


      </ul>

      <div>
      {
         hasBeenSubmitted == false
         ?
           <div style={{ padding: "10px"}}>
           <input
             type="text"
             onChange={e => this.setState({ message: e.target.value})}
             placeholder="Enter your phone number to recieve a code"
             style={{ width:"200px"}}
           />

           <button onClick={() => this.putDataToDb(this.state.message)}>
           Send Me A Code!
           </button>
          </div>
        :

            <div style={{ padding: "10px" }}>
            <input
               type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ code: e.target.value })}
              placeholder="Enter the code your recieved via SMS"
            />
            <button onClick={() => this.matchFromDb(this.state.code)}>
              Check Code
            </button>
            <button onClick={() => this.resetPage()}>Reset</button>
          </div>

      }
      </div>
    </div>
    );
  }
}

export default App;
