import React from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { setConnectionParams, testConnection } from '../../../redux/modules/blynk/actions';

export class ConnectionPage extends React.Component {
    state = {
        busy: false,
        connectionError: null,
    };

    handleSubmit = async params => {
        const { setConnectionParams, history, testConnection } = this.props;

        setConnectionParams({
            token: params.token,
            serverHost: params.serverHost,
            serverPort: params.serverPort,
        });

        this.setState({ busy: true });
        try {
            await testConnection();

            history.push('project');
        } catch (e) {
            const error = e.response ? e.response.text : e.message;
            this.setState({ busy: false, connectionError: error });
        }
    };

    render() {
        const { busy, connectionError } = this.state;
        const { token, serverHost, serverPort } = this.props;

        return (
            <div>
                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={{
                        token,
                        serverHost,
                        serverPort,
                    }}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Auth token</label>
                                <Field name="token" component="input" />
                            </div>

                            <h2>Custom server</h2>

                            <div>
                                <label>Host</label>
                                <Field name="serverHost" component="input" />
                            </div>

                            <div>
                                <label>Port</label>
                                <Field name="serverPort" component="input" />
                            </div>

                            <button type="submit" disabled={busy}>
                                {busy ? 'Connecting...' : 'Connect'}
                            </button>
                        </form>
                    )}
                />
                {connectionError && <span>Connection to server problem ({connectionError})</span>}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        token: state.blynk.get('token'),
        serverHost: state.blynk.get('serverHost'),
        serverPort: state.blynk.get('serverPort'),
    };
}

export default connect(
    mapStateToProps,
    {
        setConnectionParams,
        testConnection,
    },
)(ConnectionPage);
