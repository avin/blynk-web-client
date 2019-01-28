import React from 'react';
import { connect } from 'react-redux';
import { getProject } from '../../../redux/modules/blynk/actions';
import styles from './styles.module.scss';
import Widget from './Widget/Widget';

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

    componentDidMount() {
        const { token, history } = this.props;
        if (!token) {
            return history.push('/connection');
        }
        this.getProject();
    }

    renderWidgets() {
        const { project } = this.props;

        return project.widgets.map(widget => <Widget key={widget.id} widget={widget} />);
    }

    render() {
        const { project } = this.props;

        if (!project) {
            return <div />;
        }

        return (
            <div className={styles.root}>
                <div className={styles.header}>ProjectPage</div>
                <div className={styles.workspace}>
                    <div className={styles.widgetsArea}>{this.renderWidgets()}</div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        token: state.blynk.get('token'),
        project: state.blynk.get('project'),
    };
}

export default connect(
    mapStateToProps,
    {
        getProject,
    },
)(ProjectPage);
