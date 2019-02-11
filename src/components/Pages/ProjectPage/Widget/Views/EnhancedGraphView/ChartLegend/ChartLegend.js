import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import { decodeBlynkColor } from '../../../../../../../utils/color';

export default class ChartLegend extends React.Component {
    static propTypes = {
        dataStreams: PropTypes.any,
    };

    handleClickItem = e => {
        const { onClickItem } = this.props;
        const { idx } = e.currentTarget.dataset;
        onClickItem(Number(idx));
    };

    render() {
        const { dataStreams, disabledItems } = this.props;

        return (
            <div className={styles.legend}>
                {dataStreams.map((dataStream, idx) => (
                    <div key={idx} className={styles.legendItem} onClick={this.handleClickItem} data-idx={idx}>
                        <div
                            className={styles.legendCell}
                            style={{
                                backgroundColor: disabledItems.includes(idx)
                                    ? undefined
                                    : decodeBlynkColor(dataStream.get('color')),
                                border: `1px solid ${decodeBlynkColor(dataStream.get('color'))}`,
                            }}
                        />
                        {dataStream.get('title')}
                    </div>
                ))}
            </div>
        );
    }
}
