import React, {Component} from 'react';
import './App.css';
import VenueList from './VenueList'

class SideBar extends Component {
   constructor() {

       super();
       this.state = {
           query: '',
           venues: []
       };
   }

// this function filters venues according to the input of the search
    handleFilterVenues = () => {
        if(this.state.query.trim() !== "") {
            const venues = this.props.venues.filter(venue => venue.name
                .toLowerCase()
                .includes(this.state.query.toLowerCase()))
            return venues;
        }
        return this.props.venues

    }

    // and this function is when there is an input this handles the change and filters the markers according to the target of the input of the search
    handleChange = (e) => {
        this.setState({query:e.target.value});
        const markers = this.props.venues.map(venue => {
            const isMatched = venue.name.toLowerCase().includes(e.target.value.toLowerCase());
            const marker = this.props.markers.find(marker => marker.id === venue.id);
            if (isMatched) {
                //this shows the markers that matches with the input
                marker.isVisible = true;
            }else {
                // this hides the markers that doesnt match with the input
                marker.isVisible = false;
            }
            return marker;
        });
        this.props.updateState({markers})
    };

    render() {

        return (
            <div className="menu">
                <input aria-label="Search Filter" type={"search"} id={"search"} placeholder={"Filter Venues"} onChange={this.handleChange}/>
                <VenueList {...this.props}
                           venues={this.handleFilterVenues()}
                           handleListItemClick={this.props.handleListItemClick} />

            </div>

        );
    }

}

export default SideBar;