import React, {useState, Component} from 'react';
import MapViewComplete from './MapViewComplete';

class MapViewCompleteComponent extends Component {
    componentDidMount(){
        console.log("On map view");
        console.log(this.props.route.params);
    }

    render(){
        return(
            <MapViewComplete props={this.props.route.params}/>
        );
    }
}

export default MapViewCompleteComponent;