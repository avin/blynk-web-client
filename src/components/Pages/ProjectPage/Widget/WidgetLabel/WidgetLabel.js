import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

const isEmptyString = str => str === '' || str === undefined;

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

        if (isEmptyString(title) && isEmptyString(information) && emptyHide) {
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
