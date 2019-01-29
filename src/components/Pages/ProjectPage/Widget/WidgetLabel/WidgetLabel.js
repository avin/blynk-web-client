import React from 'react';
import styles from './styles.module.scss';

export default class WidgetLabel extends React.Component {
    render() {
        const { title, information } = this.props;

        if (!title && !information) {
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
