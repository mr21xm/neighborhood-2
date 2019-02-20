
import React, {Component} from "react";


export default class ListItem extends Component {

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.props.handleListItemClick(this.props);
        }
    }

    render() {
        return (

            <li className="listItem" onClick={() => this.props.handleListItemClick(this.props)} onKeyPress={this.handleKeyPress} tabIndex="0" aria-label="Burger place button for more information">
                <img src={this.props.categories[0].icon.prefix+"32"+this.props.categories[0].icon.suffix} alt={this.props.categories[0].name} style={{color:`black`}} aria-label="icon of the item"  />
                {this.props.name}

            </li>
        )
    }
}