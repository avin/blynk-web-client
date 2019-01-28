import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import ConnectionPage from '../Pages/ConnectionPage/ConnectionPage';
import ProjectPage from '../Pages/ProjectPage/ProjectPage';

export default class Root extends React.Component {
    render() {
        const { store } = this.props;
        return (
            <Provider store={store}>
                <Router>
                    <>
                        <Route exact path="/" render={() => <Redirect to="/project" />} />
                        <Route exact path="/connection" component={ConnectionPage} />
                        <Route exact path="/project" component={ProjectPage} />
                    </>
                </Router>
            </Provider>
        );
    }
}
