import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import SideBar from './SideBar'


class App extends Component {

    state = {
        venues: [],
        allPlaces: [],
        markers: [],

        updateState: obj => {
            this.setState(obj);
        }
    }
    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
           this.toggleCollapse();
        }
    }
    componentDidMount() {
        this.getVenues();

    }


    toggleCollapse =() => {
        let menu = document.getElementsByClassName('menu')[0];// Get the menu element

        // If the menu is displayed
        if(menu.style.display !== 'none') {
            //Set Log animation and hide the menu
            menu.style.display = 'none'
        } else {
            menu.style.display = 'inline'
        }
    }

    handleListItemClick = venue => {
        const marker = this.state.markers.find(marker => marker.id === venue.id);
        const menu = document.getElementsByClassName('menu')[0];
        const mq = window.matchMedia("(max-width: 540px)");

        if (marker.id === venue.id) {
            window.google.maps.event.trigger(marker, 'click');
            if (mq.matches) {
                menu.style.display = 'none'
            } else {
               menu.style.display = 'inline'
            }
            return marker;
        }
    }
    renderMap = () => {
        loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyB3MDmTw0TTCvNztu05oiJMyxes-vxH-R0&callback=initMap")
        window.initMap = this.initMap
    }

    getVenues = () => {
        const endPoint = "https://api.foursquare.com/v2/venues/explore?"
        const parameters = {
            client_id: "ESXNHH0D35OKRRG02RVQL0GJTNB0CTXYD5FZA02B4PZ4JCTD",
            client_secret: "Q2NTELFIVBVKRPHV3JK2ULRZM3KCGIUXT2RT0ZSMTIRCQ3BQ",
            query: "burger",
            near: "Abu Dhabi, UAE",
            v: "20191702",
            limit: 20
        }
        axios.get(endPoint + new URLSearchParams(parameters))
            .then(response => {
                this.setState({
                    venues: response.data.response.groups[0].items,
                    allPlaces: response.data.response.groups[0].items
                }, this.renderMap())
            })
            .catch(error => {
                console.log("ERROR!" + error)
            })
    }


    initMap = () => {
        // Create the map
        var map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat:24.463002, lng: 54.377902},
            zoom: 14
        })

         // InfoWindow
        var infowindow = new window.google.maps.InfoWindow();
        let markers = [];
        // setting marker and infoWindow on each venue
        this.state.venues.map(myVenue => {
            var contentString = `<div>
                <p>Restaurant Name :  ${myVenue.venue.name} </p>
                <p>Location :  ${myVenue.venue.location.address} </p>
                <p>ID : ${myVenue.venue.id}</p>
            </div>`
            // Marker
            var marker = new window.google.maps.Marker({
                position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
                map: map,
                title: myVenue.venue.name,
                id : myVenue.venue.id,
            });

            markers.push(marker);
            // listener to open InfoWindow
            marker.addListener('click', function () {
                //Animate when clicked
                marker.setAnimation(window.google.maps.Animation.BOUNCE);
                setTimeout(() => {
                    marker.setAnimation(null);// then stop animation after 3 seconde
                }, 2000);
                // change the content
                infowindow.setContent(contentString)
                // Open InfoWindow when marker is clicked
                infowindow.open(map, marker);

            });
            return marker
        });
        // Handle error map
        window.gm_authFailure = () => {
            // Display alert message
            alert('Oops!! Google maps Error loading!');
            this.setState({mapError: true})
        };
       return this.setState({markers : markers})
    };


    filterPlaces = (places) => {
        this.setState({places})
    };

    render() {
        return (
            <main>
                <nav>
            <span className="icon">
            <i className="fas fa-bars" onClick={() => this.toggleCollapse()} onKeyPress={this.handleKeyPress} tabIndex="0" aria-label= "button-role"></i>
          </span>
                    <h1 aria-label = "title of page">NeighborHood</h1>
                </nav>

                        <div id="app">
                            <SideBar places={this.state.allPlaces}
                                     filterPlaces={this.filterPlaces}
                                     markers={this.state.markers}
                                     handleListItemClick={this.handleListItemClick}
                            />

                            <div id="map" aria-hidden = "true"></div>
                        </div>


            </main>
        );
    }
}

function loadScript(url) {
    var index = window.document.getElementsByTagName("script")[0]
    var script = window.document.createElement("script")
    script.src = url
    script.async = true
    script.defer = true
    index.parentNode.insertBefore(script, index)
}

export default App;

