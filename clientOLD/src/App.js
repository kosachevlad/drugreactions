import React, { Component } from 'react';

import DrugsComponent from './components/DrugsComponent';
import ReactionsComponent from './components/ReactionsComponent';
import ReportsComponent from './components/ReportsComponent';
import { Grid, Segment, Container, Header } from 'semantic-ui-react';

import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            drugs: [],
            reactions: [],
        };
    }
    drugListChanged = (drugs) => {
        console.log('Drugs list has been updated.', drugs);
        this.setState({ drugs: drugs });
    }

    reactionsListChanged = (reactions) => {
        console.log('Reactions list has been updated.', reactions);
        this.setState({ reactions: reactions });
    }

    render() {
        return (
            <div className="App">
                <Container>
                    <Header size='large' textAlign='center' style={{paddingTop: '0.5em' }}>Patient Investigator</Header>
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment>
                                    <DrugsComponent onChange={this.drugListChanged} />
                                </Segment>
                                <Segment>
                                    <div className="table-header">Associated reactions</div>
                                    <ReactionsComponent drugs={this.state.drugs} onChange={this.reactionsListChanged} />
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                                <Segment>
                                    <ReportsComponent possibleReactions={this.state.reactions} onChange={this.reportedReactionsListChanged}/>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default App;
