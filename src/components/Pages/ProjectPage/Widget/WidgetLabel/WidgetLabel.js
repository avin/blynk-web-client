import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

export default class WidgetLabel extends React.Component {
    static propTypes = {
        title: PropTypes.node,
        information: PropTypes.node,
        emptyHide: PropTypes.bool,
    };

    static defaultProps = {
        emptyHide: true,
    };

    render() {
        const { title, information, emptyHide } = this.props;

        if (!title && !information && emptyHide) {
            return <div />;
        }

        return (
            <div className={styles.root}>
                <div className={styles.title}>{title}</div>
                <div className={styles.information}>{information}</div>
            </div>
        );
    }
}
