import React, { Component } from 'react';
import { Route } from "react-router-dom";
import Sidebar from './Views/navigation/Sidebar';
import TesterHome from './Views/home/TesterHome';

class Main extends Component {
    render(){
        return(
            <div>
                <Route path = "/sidebar" component = {Sidebar} />
                <Route path="/tester/home" component={TesterHome} />
            </div>
        )
    }
}

export default Main;