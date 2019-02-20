import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import SideBar from './SideBar'
import Footer from './Footer'

class App extends Component {

    state = {
        venues: [],
        allPlaces: [],
        markers: [],

        updateState: obj => {
            this.setState(obj);
        }
    };
    // When a key is pressed this function checks that is an enter key then it will toggle the sidebar
    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
           this.toggleCollapse();
        }
    };

    componentDidMount() {
        this.getVenues();

    }

    // This function changes the sidebar to show or hide according to its current display state
    toggleCollapse =() => {
        let menu = document.getElementsByClassName('menu')[0];// Get the menu element

        // If the menu is displayed
        if(menu.style.display !== 'inline') {
            // Set the menu's style to hide it
            menu.style.display = 'inline'
        } else {
          // Set the menu's style to show it
            menu.style.display = 'none'
        }
    }

    // handle the list items when they are clicked
    handleListItemClick = venue => {
        const marker = this.state.markers.find(marker => marker.id === venue.id); // the marker id's and the venue's id are the same
        const menu = document.getElementsByClassName('menu')[0];
        const mq = window.matchMedia("(max-width: 540px)"); // screen max width for the event listener
        // if both id's are equal
        if (marker.id === venue.id) {
          // the eventlistener for the marker will be triggered
            window.google.maps.event.trigger(marker, 'click');
          //  if the screen width matches
            if (mq.matches) {
              // the menu hides when one of the items on the list is clicked
                menu.style.display = 'none'
            } else {
              //the menu stays showing when one of the items on the list is clicked
               menu.style.display = 'inline'
            }
            return marker;
        }
    }
    // renders the map and loads the google map script
    renderMap = () => {
        loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyB3MDmTw0TTCvNztu05oiJMyxes-vxH-R0&callback=initMap")
        window.initMap = this.initMap
    }

    // fetches from foursquare using axios package
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
            }) // handle error foursquare
            .catch(error => {
                alert("ERROR!" + error)
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


    render() {
        return (
    <main>
            <header>
                <nav>
                  <span className="icon">
                    <i className="fas fa-bars" onClick={() => this.toggleCollapse()} onKeyPress={this.handleKeyPress} tabIndex="0" aria-label= "Menu Button"></i>
                  </span>
                    <h1 aria-label = "Title of page">NeighborHood</h1>
               </nav>
            </header>


            <div id="app">
                            <SideBar places={this.state.allPlaces}
                                     markers={this.state.markers}
                                     handleListItemClick={this.handleListItemClick}
                            />

                            <div id="map" aria-hidden = "true" aria-label="Google Maps"></div>
            </div>

            <Footer />

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
