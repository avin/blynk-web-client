import React from 'react';
import { connect } from 'react-redux';
import cn from 'clsx';
import { Button, HTMLSelect, Intent } from '@blueprintjs/core';
import SizeMe from '@avinlab/react-size-me';
import { getProject, logout, setAutoSyncValue, sync } from '../../../redux/modules/blynk/actions';
import styles from './styles.module.scss';
import Widget from './Widget/Widget';
import Scrollbar from '../Scrollbar/Scrollbar';

export class ProjectPage extends React.Component {
    async componentDidMount() {
        const { history, getProject } = this.props;
        try {
            await getProject();
        } catch (e) {
            history.push('/connection');
        }
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

    handleLogout = () => {
        const { history, logout } = this.props;
        logout();
        history.push('/connection');
    };

    handleChangeAutoSync = e => {
        const { setAutoSyncValue } = this.props;
        const value = Number(e.currentTarget.value);
        setAutoSyncValue(value);
    };

    handleSync = () => {
        const { sync } = this.props;
        sync();
    };

    render() {
        const { project, autoSync } = this.props;

        if (!project) {
            return <div />;
        }

        const isDarkTheme = project.get('theme') === 'Blynk' || true;

        return (
            <div className={cn(styles.root, { 'bp3-dark': isDarkTheme })}>
                <div className={styles.header}>
                    <div className={styles.headerInner}>
                        <div className={styles.headerTitle}>{project.get('name')}</div>
                        <div className={styles.headerControls}>
                            <div>
                                <Button icon="refresh" intent={Intent.PRIMARY} onClick={this.handleSync}>
                                    Sync
                                </Button>
                            </div>
                            <div>
                                <HTMLSelect
                                    className={styles.selectAutoSync}
                                    onChange={this.handleChangeAutoSync}
                                    value={autoSync}
                                    options={[
                                        { label: 'No Auto-sync', value: 0 },
                                        { label: 'Auto-sync every 0.5 sec', value: 500 },
                                        { label: 'Auto-sync every 1 sec', value: 1000 },
                                        { label: 'Auto-sync every 2 sec', value: 2000 },
                                        { label: 'Auto-sync every 3 sec', value: 3000 },
                                        { label: 'Auto-sync every 5 sec', value: 5000 },
                                        { label: 'Auto-sync every 10 sec', value: 10000 },
                                        { label: 'Auto-sync every 15 sec', value: 15000 },
                                        { label: 'Auto-sync every 30 sec', value: 30000 },
                                        { label: 'Auto-sync every 60 sec', value: 60000 },
                                    ]}
                                />
                            </div>
                            <div className={styles.headerDelimiter} />
                            <div>
                                <Button icon="log-out" intent={Intent.DANGER} onClick={this.handleLogout} />
                            </div>
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
        activeTabId: state.blynk.get('activeTabId'),
        project: state.blynk.get('project'),
        autoSync: state.blynk.get('autoSync'),
    };
}

export default connect(
    mapStateToProps,
    {
        logout,
        getProject,
        sync,
        setAutoSyncValue,
    },
)(ProjectPage);
