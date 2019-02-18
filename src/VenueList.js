import React, {Component} from "react";
import ListItem from './ListItem';

export default class VenueList extends Component {
    render() {
        return (
            <div className="scroll">
                <ol className="venueList">
                    {this.props.venues &&
                    this.props.venues.map((venue,idx) =>
                        <ListItem key={idx} {...venue} handleListItemClick={this.props.handleListItemClick} />
                    )}
                </ol>
            </div>
        )
    }
}