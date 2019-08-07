import React from 'react';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import checkApiCallStatus from '../utils/Utils';
import './ReactionsComponent.css';

class ReactionsComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reactions: [],
        };
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.drugs !== nextProps.drugs) {
            if (nextProps.drugs.length === 0) {
                this.props.onChange([]);
                this.setState({ reactions: [] });
                return;
            }
            let url = '/api/reaction/' + nextProps.drugs.map(option => option.ID).join(',');// using the proxy set up in package.json
            fetch(url, { accept: "application/json" })
                .then(checkApiCallStatus)
                .then(response => response.json())
                .then(response => {
                    this.props.onChange(response);
                    this.setState({ reactions: response });
                })
                .catch(error => {
                    console.log(error);
                    this.setState({ reactions: [], error, isLoading: false });
                });
        }
    }

    render = () => {
        const { reactions } = this.state;
        const reactionsCount = {};

        reactions.forEach((value, index) => {
            if (reactionsCount[value.REACTION]) {
                reactionsCount[value.REACTION] += 1;
            } else {
                reactionsCount[value.REACTION] = 1;
            }
        });
        const resultData = [];
        for (let key in reactionsCount) {
            resultData.push({ "Reaction": key, "Count": reactionsCount[key] });
        }
        console.log('reactions',reactions)
        console.log('reactionsCount', reactionsCount, Object.keys(reactionsCount).length)
        return (<ReactTable
            data={resultData}
            columns={[
                {
                    Header: "Associated reactions",
                    columns: [
                        {
                            Header: "Reaction",
                            accessor: "Reaction"
                        },
                        {
                            Header: "no. drugs",
                            accessor: "Count",
                            maxWidth: 120,
                            className: "text-align-center"
                        }
                    ]
                }
            ]}
            defaultSorted={[
                {
                    id: "Count",
                    desc: true
                }
            ]}
            resizable={false}
            pageSize={resultData.length}
            showPagination={false}
            noDataText="No drugs selected!"
            className="-striped -highlight reactions-component-container"
        />);
    }
}

export default ReactionsComponent;