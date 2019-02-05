import React from 'react';
import { connect } from 'react-redux';
import cn from 'clsx';
import { Button } from '@blueprintjs/core';
import SizeMe from '@avinlab/react-size-me';
import { getProject, logout } from '../../../redux/modules/blynk/actions';
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
                            <Button icon="log-out" onClick={this.handleLogout} />
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
    };
}

export default connect(
    mapStateToProps,
    {
        logout,
        getProject,
    },
)(ProjectPage);
