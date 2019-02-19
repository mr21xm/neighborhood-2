import React, {Component} from "react";
import ListItem from './ListItem';

export default class VenueList extends Component {
    render() {
        return (
            <div className="scroll">
                {
                    this.props.venues.length===0 && (

                        <ol className="venueList">
                            {this.props.places.map((venue,idx) =>
                                <ListItem key={idx} {...venue.venue} handleListItemClick={this.props.handleListItemClick} />
                            )}
                        </ol>
                    )

                }
                {
                    <ol className="venueList">
                        {this.props.venues.map((venue,idx) =>
                            <ListItem key={idx} {...venue} handleListItemClick={this.props.handleListItemClick} />
                        )}
                    </ol>

                }

            </div>
        )
    }
}