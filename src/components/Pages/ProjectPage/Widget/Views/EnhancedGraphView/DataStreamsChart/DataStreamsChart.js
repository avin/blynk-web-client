import React from 'react';
import styles from './styles.module.scss';

export default class DataStreamsChart extends React.Component {
    render() {
        const { width, height } = this.props;

        return (
            <div className={styles.chartContainer} style={{ width, height }}>
                CHART_HERE
            </div>
        );
    }
}
