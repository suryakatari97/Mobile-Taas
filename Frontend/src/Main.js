import React, { Component } from 'react';
import { Route } from "react-router-dom";
import Sidebar from './Views/navigation/Sidebar';

class Main extends Component {
    render(){
        return(
            <div>
                <Route path = "/sidebar" component = {Sidebar} />
            </div>
        )
    }
}

export default Main;