import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from '@blueprintjs/core';
import SizeMe from '@avinlab/react-size-me';
import { getPinHistory } from '../../../../../../redux/modules/blynk/actions';
import { widgetDataStreamsHistorySelector } from '../../../../../../redux/selectors';
import styles from './styles.module.scss';
import DataStreamsChart from './DataStreamsChart/DataStreamsChart';

export class EnhancedGraphView extends React.Component {
    state = {
        historyIsReady: false,
    };

    async getHistory() {
        const { widget, getPinHistory } = this.props;

        for (const dataStream of widget.get('dataStreams')) {
            const pinId = dataStream.getIn(['pin', 'pinId']);
            await getPinHistory(pinId);
        }

        this.setState({
            historyIsReady: true,
        });
    }

    componentDidMount() {
        this.getHistory();
    }

    renderChart() {
        const { widget, dataStreamsHistory } = this.props;

        return (
            <div className={styles.chart}>
                <SizeMe>
                    {({ width, height }) => (
                        <DataStreamsChart
                            dataStreams={widget.get('dataStreams')}
                            dataStreamsHistory={dataStreamsHistory}
                            width={width}
                            height={height}
                        />
                    )}
                </SizeMe>
            </div>
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

        return (
            <>
                <b>WidgetEnhancedGraph</b>
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
