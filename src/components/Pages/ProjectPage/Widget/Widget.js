import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import WidgetButton from './WidgetButton/WidgetButton';
import WidgetSlider from './WidgetSlider/WidgetSlider';
import WidgetNumericalDisplay from './WidgetNumericalDisplay/WidgetNumericalDisplay';
import WidgetUnknown from './WidgetUnknown/WidgetUnknown';
import WidgetEnhancedGraph from './WidgetEnhancedGraph/WidgetEnhancedGraph';
import { widgetValueSelector } from '../../../../redux/selectors';

const WIDGET_COMPONENTS = {
    BUTTON: WidgetButton,
    SLIDER: WidgetSlider,
    VERTICAL_SLIDER: WidgetUnknown,
    KNOB: WidgetUnknown,
    TIMER: WidgetUnknown,
    ROTARY_KNOB: WidgetUnknown,
    RGB: WidgetUnknown,
    TWO_WAY_ARROW: WidgetUnknown,
    FOUR_WAY_ARROW: WidgetUnknown,
    ONE_AXIS_JOYSTICK: WidgetUnknown,
    TWO_AXIS_JOYSTICK: WidgetUnknown,
    GAMEPAD: WidgetUnknown,
    KEYPAD: WidgetUnknown,

    // outputs
    LED: WidgetUnknown,
    LOGGER: WidgetUnknown,
    ENHANCED_GRAPH: WidgetEnhancedGraph,
    DIGIT4_DISPLAY: WidgetNumericalDisplay,
    GAUGE: WidgetUnknown,
    LCD_DISPLAY: WidgetUnknown,
    GRAPH: WidgetUnknown,
    LEVEL_DISPLAY: WidgetUnknown,
    TERMINAL: WidgetUnknown,

    // inputs
    MICROPHONE: WidgetUnknown,
    GYROSCOPE: WidgetUnknown,
    ACCELEROMETER: WidgetUnknown,
    GPS: WidgetUnknown,

    // notifications
    TWITTER: WidgetUnknown,
    EMAIL: WidgetUnknown,
    NOTIFICATION: WidgetUnknown,

    // other
    SD_CARD: WidgetUnknown,
    EVENTOR: WidgetUnknown,
    RCT: WidgetUnknown,
    BRIDGE: WidgetUnknown,
    BLUETOOTH: WidgetUnknown,

    // UI
    MENU: WidgetUnknown,
};

export class Widget extends React.Component {
    renderContent() {
        const { widget, value } = this.props;
        const WidgetComponent = WIDGET_COMPONENTS[widget.get('type')] || WidgetUnknown;
        return <WidgetComponent widget={widget} value={value} />;
    }

    render() {
        const { widget } = this.props;

        const sizeHeightFactor = 60;
        const sizeWidthFactor = 70;
        const margin = 1;

        return (
            <div
                className={styles.root}
                style={{
                    left: widget.get('x') * sizeWidthFactor,
                    top: widget.get('y') * sizeHeightFactor,
                    width: widget.get('width') * sizeWidthFactor - margin,
                    height: widget.get('height') * sizeHeightFactor - margin,
                }}
            >
                {this.renderContent()}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const widgetId = ownProps.widget.get('id');

    return {
        value: widgetValueSelector(state, widgetId),
    };
}

export default connect(
    mapStateToProps,
    {},
)(Widget);
