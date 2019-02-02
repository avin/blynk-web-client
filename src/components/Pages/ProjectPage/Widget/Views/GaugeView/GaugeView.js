import React from 'react';
import { connect } from 'react-redux';
import SizeMe from '@avinlab/react-size-me';
import styles from './styles.module.scss';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import GaugeChart from './GaugeChart/GaugeChart';
import { pinValueSelector } from '../../../../../../redux/selectors';

export class GaugeView extends React.Component {
    render() {
        const { widget, value } = this.props;

        return (
            <>
                <WidgetLabel title={widget.get('label') || 'Gauge'} />
                <div className={styles.chart}>
                    <SizeMe>
                        {({ width, height }) =>
                            !!height && (
                                <GaugeChart
                                    width={width}
                                    height={height}
                                    min={widget.get('min')}
                                    max={widget.get('max')}
                                    value={Number(value)}
                                    valueFormatting={widget.get('valueFormatting')}
                                />
                            )
                        }
                    </SizeMe>
                </div>
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const pinId = ownProps.widget.get('pinId');
    return {
        value: pinValueSelector(state, pinId),
    };
}

export default connect(
    mapStateToProps,
    {},
)(GaugeView);
