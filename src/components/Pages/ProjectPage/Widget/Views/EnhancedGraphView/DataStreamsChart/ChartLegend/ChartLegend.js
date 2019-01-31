import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';

export default class ChartLegend extends React.Component {
    static propTypes = {
        colorScale: PropTypes.func,
        dataStreams: PropTypes.any,
    };

    render() {
        const { dataStreams, colorScale } = this.props;

        return (
            <div className={styles.legend}>
                {dataStreams.map((dataStream, idx) => (
                    <div key={idx} className={styles.legendItem}>
                        <div className={styles.legendCell} style={{ backgroundColor: colorScale(idx) }} />
                        {dataStream.get('title')}
                    </div>
                ))}
            </div>
        );
    }
}
