import React, {Component} from 'react';
import './App.css';
import VenueList from './VenueList'
import escapeRegExp from 'escape-string-regexp';

class SideBar extends Component {
    constructor() {

        super();
        this.state = {
            query: '',
            venues: [],
            listItems: []
        };
    }

// this function filters venues according to the input of the search
    handleFilterVenues = () => {
       /* if(this.state.query.trim() !== "") {
            const venues = this.props.venues.filter(venue => venue.name
                .toLowerCase()
                .includes(this.state.query.toLowerCase()))
            return venues;
        } */
        // filter((venue) => matches.test(venue.venue.name));
       // return this.props.venues

    };

    // and this function is when there is an input this handles the change and filters the markers according to the target of the input of the search
    handleChange = (e) => {
        let matches = new RegExp(escapeRegExp(e), 'i')
        let filtred = this.props.places.filter((venue) => matches.test(venue.venue.name));
        this.setState({query : e});
        let venues = [];
        filtred.map(place => {
            return venues.push(place.venue)
        });

        if (this.state.venues.length > 0) {

            this.setState({listItems: venues})
            //marker
            this.props.markers.map(marker =>{

                marker.setVisible(false);
                venues.forEach(venue=>{

                    console.log(marker.id && venue.id);
                    return marker.id === venue.id && marker.setVisible(true);

                })
                return marker;
            })
        } else {
            this.setState({listItems: this.state.places})

        }
        return this.setState({venues});

        /*  const markers = this.props.venues.map(venue => {
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
          }); */
        // this.props.updateState({markers})
    };


    render() {

        return (
            <div className="menu">
                <input aria-label="Search Filter" type={"search"} id={"search"} placeholder={"Filter Venues"} onChange={(e) => {this.handleChange(e.target.value)}}/>
                <VenueList venues={this.state.venues}
                           places={this.props.places}
                           query={this.state.query}
                           handleListItemClick={this.props.handleListItemClick} />

            </div>

        );
    }

}

export default SideBar;