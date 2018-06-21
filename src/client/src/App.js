import React, {
  Component,
  Context
} from "react";
import Header from "./containers/Header";
import Main from "./containers/Main";
import "./App.css";

const SearchContext = React.createContext();

class AppProvider extends Component {
  render() {
    return (<SearchContext.Provider value ={
        this.state
      }
    />);
    }
  }


  class App extends Component {
    render() {
      return (<div >

        <Header />

        <Main />

               </div >
      );
    }
  }

  export default App;
