import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from '@blueprintjs/core';
import SizeMe from '@avinlab/react-size-me';
import * as Immutable from 'immutable';
import { getPinHistory } from '../../../../../../redux/modules/blynk/actions';
import { widgetDataStreamsHistorySelector } from '../../../../../../redux/selectors';
import styles from './styles.module.scss';
import DataStreamsChart from './DataStreamsChart/DataStreamsChart';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import ChartLegend from './ChartLegend/ChartLegend';
import ChartControl from './ChartControl/ChartControl';

export class EnhancedGraphView extends React.Component {
    state = {
        historyIsReady: false,
        hiddenDataStreams: [],
    };

    async getHistory() {
        const { widget, getPinHistory } = this.props;

        for (const dataStream of widget.get('dataStreams', new Immutable.List())) {
            const pinId = dataStream.getIn(['pin', 'pinId']);
            await getPinHistory({ deviceId: dataStream.get('targetId'), pin: pinId });
        }

        this.setState({
            historyIsReady: true,
        });
    }

    componentDidMount() {
        this.getHistory();
    }

    handleChangeDuration = duration => {
        if (this.dataStreamsChart && this.dataStreamsChart.chart) {
            this.dataStreamsChart.chart.setChartDuration(duration);
        }
    };

    handleClickLegendItem = itemId => {
        let { hiddenDataStreams } = this.state;
        if (hiddenDataStreams.includes(itemId)) {
            hiddenDataStreams = hiddenDataStreams.filter(i => i !== itemId);
        } else {
            hiddenDataStreams = [...hiddenDataStreams, itemId];
        }
        this.setState({ hiddenDataStreams });
    };

    renderChart() {
        const { widget, dataStreamsHistory } = this.props;
        const { hiddenDataStreams } = this.state;

        const showXAxis = widget.get('xAxisValues');

        return (
            <>
                <div className={styles.header}>
                    <ChartLegend
                        dataStreams={widget.get('dataStreams')}
                        onClickItem={this.handleClickLegendItem}
                        disabledItems={hiddenDataStreams}
                    />
                    <ChartControl onChangeDuration={this.handleChangeDuration} />
                </div>
                <div className={styles.chart}>
                    <SizeMe>
                        {({ width, height }) =>
                            !!height && (
                                <DataStreamsChart
                                    dataStreams={widget.get('dataStreams')}
                                    dataStreamsHistory={dataStreamsHistory}
                                    controlBlockRef={this.controlBlockRef}
                                    legendBlockRef={this.legendBlockRef}
                                    showXAxis={showXAxis}
                                    width={width}
                                    height={height}
                                    disabledItems={hiddenDataStreams}
                                    ref={i => {
                                        this.dataStreamsChart = i;
                                    }}
                                />
                            )
                        }
                    </SizeMe>
                </div>
            </>
        );
    }

    renderLoading() {
        return (
            <div className={styles.loading}>
                <Spinner />
            </div>
        );
    }

    render() {
        const { historyIsReady } = this.state;
        const { widget } = this.props;

        return (
            <>
                <WidgetLabel
                    title={
                        <div className={styles.widgetLabelContainer}>
                            <span className={styles.widgetLabel}>{widget.get('label')}</span>
                            <div
                                ref={i => {
                                    this.legendBlockRef = i;
                                }}
                            />
                        </div>
                    }
                    information={
                        <div
                            ref={i => {
                                this.controlBlockRef = i;
                            }}
                        />
                    }
                    emptyHide={false}
                />
                {historyIsReady ? this.renderChart() : this.renderLoading()}
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        dataStreamsHistory: widgetDataStreamsHistorySelector(state, ownProps.widget),
    };
}

export default connect(
    mapStateToProps,
    {
        getPinHistory,
    },
)(EnhancedGraphView);
