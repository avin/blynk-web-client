import React from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import cn from 'clsx';
import { Button, FormGroup, HTMLSelect, InputGroup, Intent } from '@blueprintjs/core';
import { setConnectionParams, testConnection } from '../../../redux/modules/blynk/actions';
import styles from './styles.module.scss';
import { required } from '../../../utils/validation';
import GitHubLink from './GitHubLink/GitHubLink';

const ErrorString = meta => (meta.error && meta.touched ? <div className={styles.error}>{meta.error}</div> : null);

const InputGroupField = ({ input, meta, ...props }) => (
    <>
        <InputGroup {...{ ...input, ...props }} />
        <ErrorString {...meta} />
    </>
);

const HTMLSelectField = ({ input, meta, ...props }) => <HTMLSelect {...{ ...input, ...props }} />;

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
            connectionMode: params.connectionMode,
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
        const { token, serverHost, serverPort, connectionMode } = this.props;

        return (
            <div className={cn('bp3-dark', styles.main)}>
                <div className={styles.emptyFiller} />
                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={{
                        token,
                        serverHost,
                        serverPort,
                        connectionMode,
                    }}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className={cn('bp3-card', styles.form)}>
                            <div className={styles.title}>Blynk Web-Client</div>
                            <FormGroup label="Auth token" labelFor="token-input">
                                <Field name="token" id="token-input" component={InputGroupField} validate={required} />
                            </FormGroup>

                            <FormGroup label="Connection mode" labelFor="connectionMode-input">
                                <Field
                                    name="connectionMode"
                                    id="connectionMode-input"
                                    component={HTMLSelectField}
                                    fill
                                    options={[{ label: 'No SSL', value: 'no-ssl' }, { label: 'SSL', value: 'ssl' }]}
                                />
                            </FormGroup>

                            <FormGroup label="Server Host" labelFor="serverHost-input">
                                <Field
                                    name="serverHost"
                                    id="serverHost-input"
                                    component={InputGroupField}
                                    validate={required}
                                />
                            </FormGroup>

                            <FormGroup label="Server Port" labelFor="serverPort-input">
                                <Field
                                    name="serverPort"
                                    id="serverPort-input"
                                    component={InputGroupField}
                                    validate={required}
                                />
                            </FormGroup>

                            <Button
                                type="submit"
                                disabled={busy}
                                icon="log-in"
                                fill
                                className={styles.submitButton}
                                intent={Intent.PRIMARY}
                            >
                                {busy ? 'Connecting...' : 'Connect'}
                            </Button>

                            {connectionError && (
                                <div className={styles.connectionProblem}>
                                    Connection to server problem ({connectionError})
                                </div>
                            )}
                        </form>
                    )}
                />

                <GitHubLink />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        token: state.blynk.get('token'),
        serverHost: state.blynk.get('serverHost'),
        serverPort: state.blynk.get('serverPort'),
        connectionMode: state.blynk.get('connectionMode'),
    };
}

export default connect(
    mapStateToProps,
    {
        setConnectionParams,
        testConnection,
    },
)(ConnectionPage);
