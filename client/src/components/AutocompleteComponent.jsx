import React from 'react';

import './AutocompleteComponent.css';

class Autocomplete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            drugName: props.value || '',
            listIsVisible: false,
            singleResult: true,

        };

        this.onBlur = this.onBlur.bind(this);
        this.handleEnterKey = this.handleEnterKey.bind(this);
    }

    getMenu = () => {
        const options = this.props.options;
        const { drugName, listIsVisible, singleResult } = this.state;

        let children = [];
        let filteredOptions = [];

        if (listIsVisible) {
            filteredOptions = options.filter(obj => obj.NAME_STD.startsWith(drugName));
            if (singleResult) {
                if (drugName.length > 0) {
                    filteredOptions = filteredOptions.slice(0, 1);
                } else {
                    filteredOptions = [];
                }
            }
            if (filteredOptions.length === 1 && filteredOptions[0].NAME_STD === drugName) {
                if (singleResult) {
                    filteredOptions = [];
                } else {
                    filteredOptions = options;
                }
            }
        }
        children = filteredOptions.map(option => <li key={option.ID}>{option.NAME_STD}</li>);
        return (
            <div className="autocomplete-menu-container">
                <ul
                    className="autocomplete-menu-list"
                    onClick={(e) => {
                        this.setState({ drugName: "", listIsVisible: false, singleResult: true })
                        this.props.onSelect(e.target.innerHTML);
                    }}
                >
                    {children}
                </ul>
            </div>
        );
    }

    handleEnterKey = (e) => {
        if (e.key === "Enter") {
            const options = this.props.options;
            const { drugName, listIsVisible, singleResult } = this.state;
            if (listIsVisible && singleResult) {
                const filteredOptions = options.filter(obj => obj.NAME_STD.startsWith(drugName));
                const nextDrugName = (filteredOptions[0] && filteredOptions[0].NAME_STD) || drugName;
                this.setState({ drugName: "", listIsVisible: false, singleResult: true });
                this.props.onSelect(nextDrugName);
            }

        } else if (e.key === "Escape") {
            e.currentTarget.value = "";
            this.setState({ drugName: "", listIsVisible: false, singleResult: true });
        }
    }

    onBlur = (e) => {
        let currentTarget = e.currentTarget;

        setTimeout((self) => {
            if (!currentTarget.contains(document.activeElement)) {
                self.setState({ listIsVisible: false, singleResult: true });
            }
        }, 0, this);
    }

    render() {
        return (
            <div className="autocomplete-component" tabIndex="1" onBlur={this.onBlur}>
                <div className="autocomplete-wrapper">
                    <input
                        type="text"
                        autoFocus={true}
                        value={this.state.drugName}
                        placeholder={this.props.placeholder}
                        onChange={(e) => this.setState({ drugName: e.target.value, listIsVisible: true, singleResult: true })}
                        onFocus={() => this.setState({ listIsVisible: true, singleResult: true })}
                        onKeyUp={this.handleEnterKey}
                        disabled={this.props.disabled}
                    />
                    <button disabled={this.props.disabled} onClick={() => this.setState({ listIsVisible: true, singleResult: !this.state.singleResult })}>
            </button>
                </div>
                {this.getMenu()}
            </div>
        );
    }
}

export default Autocomplete;