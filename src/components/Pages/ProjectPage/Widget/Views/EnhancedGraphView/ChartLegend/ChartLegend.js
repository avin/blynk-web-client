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
                {dataStreams.map((dataStream, idx) => {
                    const color = decodeBlynkColor(dataStream.get('color'), true);

                    return (
                        <div key={idx} className={styles.legendItem} onClick={this.handleClickItem} data-idx={idx}>
                            <div
                                className={styles.legendCell}
                                style={{
                                    backgroundColor: disabledItems.includes(idx) ? undefined : color[1],
                                    border: `1px solid ${color[1]}`,
                                }}
                            />
                            {dataStream.get('title')}
                        </div>
                    );
                })}
            </div>
        );
    }
}
