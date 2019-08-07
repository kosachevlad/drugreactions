import React from 'react';

import Autocomplete from './AutocompleteComponent';

import './DrugsComponent.css';
import checkApiCallStatus from '../utils/Utils';

class DrugsComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            drugs: [],
            selectedDrugs: JSON.parse(localStorage.getItem('selectedDrugs')) || []
        };
        this.onDrugSelected = this.onDrugSelected.bind(this);
        this.removeDrug = this.removeDrug.bind(this);
        this.removeAllDrugs = this.removeAllDrugs.bind(this);
    }

    componentDidMount = () => {
        let url = '/api/drugs';// using the proxy set up in package.json
        
        fetch('http://localhost:3000/api/drugs', { accept: "application/json" })
            .then(response => response.json())
            .then(response => {
              console.log('1',response);
                this.setState({ drugs: response });
                this.props.onChange(response.filter(drug => this.state.selectedDrugs.indexOf(drug.NAME_STD) !== -1));
            })
            .catch(error => {
                console.log(error);
                this.setState({ error, isLoading: false });
            });
    }

    onDrugSelected = (drugName) => {
        const drugsList = this.state.selectedDrugs.slice();
        if (drugsList.indexOf(drugName) === -1) {
            drugsList.push(drugName);
        }
        this.setState({ selectedDrugs: drugsList });
        localStorage.setItem('selectedDrugs', JSON.stringify(drugsList));
        this.props.onChange(this.state.drugs.filter(drug => drugsList.indexOf(drug.NAME_STD) !== -1));
    }

    removeDrug = (drugName) => {
        const drugsList = this.state.selectedDrugs.slice();
        drugsList.splice(drugsList.indexOf(drugName), 1);
        this.setState({ selectedDrugs: drugsList });
        localStorage.setItem('selectedDrugs', JSON.stringify(drugsList));
        this.props.onChange(this.state.drugs.filter(drug => drugsList.indexOf(drug.NAME_STD) !== -1));
    }

    removeAllDrugs = () => {
        this.setState({ selectedDrugs: [] });
        localStorage.setItem('selectedDrugs', JSON.stringify([]));
        this.props.onChange([]);
    }

    showSelectedDrugs = () => {
        const selectedDrugs = this.state.selectedDrugs;
        const children = selectedDrugs.map(option => <div className="drug-item-container" key={option}>
            <div className="drug-component-autocomplete">
                <Autocomplete
                    value={option}
                    disabled={true}
                />
            </div>
            <div className="drug-component-button">
                <button
                    className="drug-remove-btn"
                    onClick={() => this.removeDrug(option)}
                ><span className="tooltiptext">Delete this drug</span></button>
            </div>
        </div>
        );
        return (<React.Fragment>{children}</React.Fragment>);
    }

    render = () => {
        return (
            <div className="drug-component-container">
                <div className="drug-component-top header-text">
                    <p>Select drugs being taken</p>
                    <button
                        className="drug-remove-btn"
                       onClick={() => this.removeAllDrugs()}
                    ><span className="tooltiptext">Delete all drugs</span></button>
                </div>

                {this.showSelectedDrugs()}
                <div className="drug-component-bottom">
                    <Autocomplete
                        options={this.state.drugs}
                        value=""
                        placeholder="Enter drug name..."
                        onSelect={this.onDrugSelected}
                    />
                </div>
            </div>
        );
    }
}

export default DrugsComponent;