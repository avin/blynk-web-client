import React from 'react';
import { connect } from 'react-redux';
import cn from 'clsx';
import { Button } from '@blueprintjs/core';
import SizeMe from '@avinlab/react-size-me';
import { getProject, logout, setPinValue } from '../../../redux/modules/blynk/actions';
import styles from './styles.module.scss';
import Widget from './Widget/Widget';
import blynkWSClient from '../../../common/blynkWSClient';
import Scrollbar from '../Scrollbar/Scrollbar';

export class ProjectPage extends React.Component {
    async getProject() {
        const { project, getProject, history } = this.props;
        if (!project) {
            try {
                await getProject();
            } catch (e) {
                history.push('/connection');
            }
        }
    }

    initWSClient = () => {
        const { token, serverHost, serverPort, connectionMode } = this.props;

        // Connect to blynk ws server
        blynkWSClient.init({
            token,
            serverHost,
            serverPort,
            connectionMode,
        });

        blynkWSClient.addEventListener('write-pin', this.handleWritePin);
    };

    componentWillUnmount() {
        blynkWSClient.removeEventListener('write-pin', this.handleWritePin);
    }

    handleWritePin = e => {
        const { setPinValue } = this.props;
        const { pin, value } = e.detail;

        setPinValue(pin, value);
    };

    componentDidMount() {
        const { token, history } = this.props;
        if (!token) {
            return history.push('/connection');
        }
        this.getProject().then(this.initWSClient);
    }

    renderWidgets() {
        const { project, activeTabId } = this.props;

        const widgets = [];
        project.get('widgets').forEach(widget => {
            const tabId = widget.get('tabId');
            if (tabId === activeTabId || widget.get('type') === 'TABS') {
                widgets.push(<Widget key={widget.get('id')} widget={widget} />);
            }
        });
        return widgets;
    }

    handleCloseConnection = () => {
        const { history, logout } = this.props;
        logout();
        history.push('/connection');
    };

    render() {
        const { project } = this.props;

        if (!project) {
            return <div />;
        }

        const isDarkTheme = project.get('theme') === 'Blynk' || true;

        return (
            <div className={cn(styles.root, { 'bp3-dark': isDarkTheme })}>
                <div className={styles.header}>
                    <div className={styles.headerInner}>
                        <div className={styles.headerTitle}>{project.get('name')}</div>
                        <div>
                            <Button icon="log-out" onClick={this.handleCloseConnection} />
                        </div>
                    </div>
                </div>
                <div className={styles.workspace}>
                    <SizeMe>
                        {({ width, height }) => {
                            return (
                                <Scrollbar style={{ height, width }}>
                                    <div className={styles.workspaceInner}>
                                        <div className={styles.widgetsArea}>{this.renderWidgets()}</div>
                                    </div>
                                </Scrollbar>
                            );
                        }}
                    </SizeMe>
                </div>
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
        activeTabId: state.blynk.get('activeTabId'),

        project: state.blynk.get('project'),
    };
}

export default connect(
    mapStateToProps,
    {
        getProject,
        setPinValue,
        logout,
    },
)(ProjectPage);
