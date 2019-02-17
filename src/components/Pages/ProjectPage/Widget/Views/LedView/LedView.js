import React from 'react';
import { connect } from 'react-redux';
import SizeMe from '@avinlab/react-size-me';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import styles from './styles.module.scss';
import { pinValueSelector } from '../../../../../../redux/selectors';
import { decodeBlynkColor } from '../../../../../../utils/color';

export class LedView extends React.Component {
    render() {
        const { widget, value } = this.props;

        const color = decodeBlynkColor(widget.get('color'));

        return (
            <>
                <WidgetLabel title={widget.get('label') || 'Led'} />
                <div className={styles.ledContainer}>
                    <SizeMe style={{ textAlign: 'center' }}>
                        {({ width, height }) => {
                            const size = Math.min(width, height) || 5;
                            return (
                                <svg width={size} height={size}>
                                    <circle
                                        r={Math.max(size / 2 - 4, 1)}
                                        cx={size / 2}
                                        cy={size / 2}
                                        className={styles.ledCircle}
                                        stroke={color}
                                        fill={color}
                                        fillOpacity={value / 255}
                                    />
                                </svg>
                            );
                        }}
                    </SizeMe>
                </div>
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const deviceId = ownProps.widget.get('deviceId');
    const pinId = ownProps.widget.get('pinId');
    return {
        value: pinValueSelector(state, deviceId, pinId) || 0,
    };
}

export default connect(
    mapStateToProps,
    {},
)(LedView);
