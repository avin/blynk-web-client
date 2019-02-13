import React from 'react';
import PropTypes from 'prop-types';
import * as Immutable from 'immutable';
import TimeseriesMultiChart from '@avinlab/d3-timeseries-multi-chart';
import styles from './styles.module.scss';
import { decodeBlynkColor } from '../../../../../../../utils/color';

export default class DataStreamsChart extends React.Component {
    static propTypes = {
        showXAxis: PropTypes.bool,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        controlBlockRef: PropTypes.instanceOf(Element),
        legendBlockRef: PropTypes.instanceOf(Element),
        dataStreams: PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.instanceOf(Immutable.Iterable)]),
        dataStreamsHistory: PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.instanceOf(Immutable.Iterable)])
            .isRequired,
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.disabledItems !== this.props.disabledItems) {
            this.renderChart();
        }
    }

    renderChart() {
        const { dataStreams, dataStreamsHistory, disabledItems } = this.props;

        const chartDataStreams = [];
        dataStreams.forEach((dataStream, idx) => {
            let type;
            switch (dataStream.get('graphType')) {
                case 'LINE':
                    type = 'line';
                    break;
                case 'BAR':
                    type = 'bar';
                    break;
                case 'FILLED_LINE':
                    type = 'area';
                    break;
                default:
                    type = 'line';
            }

            if (!disabledItems.includes(idx)) {
                const color = decodeBlynkColor(dataStream.get('color'), true);

                const chartDataStream = {
                    label: dataStream.get('title'),
                    color: color[1],
                    colorFrom: color[1],
                    colorTo: color[0],
                    data: dataStreamsHistory[idx],
                    showAxis: dataStream.get('showYAxis'),
                    strokeWidth: 1,
                    showDots: type === 'bar',
                    type,
                };

                if (dataStream.get('yAxisScale') === 'HEIGHT') {
                    chartDataStream.scaleRange = [
                        100 - dataStream.get('yAxisMax', 100),
                        100 - dataStream.get('yAxisMin', 0),
                    ];
                }

                chartDataStreams.push(chartDataStream);
            }
        });

        this.chart.render(chartDataStreams);
    }

    componentDidMount() {
        const { width, height, showXAxis } = this.props;
        this.chart = new TimeseriesMultiChart({
            target: this.containerRef,
            chartDuration: 3600 * 24000,
            width,
            height,
            showTimeAxis: true || showXAxis,
        });
        this.renderChart();
    }

    render() {
        const { width, height } = this.props;

        return (
            <div
                className={styles.chartContainer}
                style={{ width, height }}
                ref={i => {
                    this.containerRef = i;
                }}
            />
        );
    }
}
