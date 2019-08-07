import React from 'react';

import Autocomplete from './AutocompleteComponent';
import checkApiCallStatus from '../utils/Utils';

import './ReportsComponent.css';

class ReportsComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            reactions: [],
            possibleReactions: [],
            selectedReactions: JSON.parse(localStorage.getItem('selectedReactions')) || []
        };
        this.onReactionSelected = this.onReactionSelected.bind(this);
        this.onReactionRemove = this.onReactionRemove.bind(this);
        this.onAllReactionsRemove = this.onAllReactionsRemove.bind(this);
    }

    componentDidMount = () => {
        let url = '/api/reactions/';// using the proxy set up in package.json
        fetch(url, { accept: "application/json" })
            .then(checkApiCallStatus)
            .then(response => response.json())
            .then(response => {
                this.setState({ reactions: response });
            })
            .catch(error => {
                console.log(error);
                this.setState({ error, isLoading: false });
            });
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.possibleReactions !== nextProps.possibleReactions) {
            this.setState({possibleReactions: nextProps.possibleReactions});
        }
    }

    onReactionSelected = (reactionName) => {
        const reactionsList = this.state.selectedReactions.slice();
        if (reactionsList.indexOf(reactionName) === -1) {
            reactionsList.push(reactionName);
        }
        this.setState({ selectedReactions: reactionsList });
        localStorage.setItem('selectedReactions', JSON.stringify(reactionsList));
    }
    onReactionRemove = (reactionName) => {
        const reactionsList = this.state.selectedReactions.slice();
        reactionsList.splice(reactionsList.indexOf(reactionName), 1);
        this.setState({ selectedReactions: reactionsList });
        localStorage.setItem('selectedReactions', JSON.stringify(reactionsList));
    }
    onAllReactionsRemove = () => {
        this.setState({ selectedReactions: [] });
        localStorage.setItem('selectedReactions', JSON.stringify([]));
    }

    showPossibleDrugs = (reaction) => {
        const {possibleReactions} = this.state;
        const filtered = possibleReactions
            .filter(possibleReaction => possibleReaction.REACTION === reaction);
        let children;
        if (filtered.length > 0) {
            children = filtered.map(option => <li key={option.DRUG_ID}>{option.DRUG_NAME_STD}</li>);
        } else {
            children = <li>- None of the selected drugs -</li>;
        }
        return (<ul className="report-component-drugs-list">{children}</ul>);
    }

    showSelectedReactions = () => {
        const selectedReactions = this.state.selectedReactions;
        const children = selectedReactions.map(option => <div key={option} className="reports-item-container">
            <div className="reports-item-wrapper">
                <div className="reports-component-autocomplete">
                    <Autocomplete
                        value={option}
                        disabled={true}
                    />
                </div>
                <div className="reports-component-button">
                    <button
                        className="reports-remove-btn"
                        onClick={() => this.onReactionRemove(option)}
                    ><span className="tooltiptext">Delete this reaction</span></button>
                </div>
            </div>
                {this.showPossibleDrugs(option)}
            </div>
            );
            return (<React.Fragment>{children}</React.Fragment>);
    }

    render = () => {
        return (
            <div className="reports-component-container">
                <div className="reports-component-top header-text">
                    <p>Enter reactions reported</p>
                    <button
                        className="reports-remove-btn"
                        onClick={() => this.onAllReactionsRemove()}
                    ><span className="tooltiptext">Delete all reactions</span>
                    </button>
                </div>

                {this.showSelectedReactions()}
                <div className="reports-component-bottom">
                    <Autocomplete
                        options={this.state.reactions}
                        value=""
                        placeholder="Enter patient reaction"
                        onSelect={this.onReactionSelected}
                    />
                </div>
            </div>
        );
    }
}

export default ReportsComponent;