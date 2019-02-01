import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import ButtonView from './Views/ButtonView/ButtonView';
import SliderView from './Views/SliderView/SliderView';
import NumericalDisplayView from './Views/NumericalDisplayView/NumericalDisplayView';
import UnknownView from './Views/UnknownView/UnknownView';
import EnhancedGraphView from './Views/EnhancedGraphView/EnhancedGraphView';
import RgbView from './Views/RgbView/RgbView';
import TwoAxisJoystickView from './Views/TwoAxisJoystickView/TwoAxisJoystickView';
import TerminalView from './Views/TerminalView/TerminalView';
import VerticalSliderView from './Views/VerticalSliderView/VerticalSliderView';

const WIDGET_VIEW_COMPONENTS = {
    BUTTON: ButtonView,
    SLIDER: SliderView,
    VERTICAL_SLIDER: VerticalSliderView,
    KNOB: UnknownView,
    TIMER: UnknownView,
    ROTARY_KNOB: UnknownView,
    RGB: RgbView,
    TWO_WAY_ARROW: UnknownView,
    FOUR_WAY_ARROW: UnknownView,
    ONE_AXIS_JOYSTICK: UnknownView,
    TWO_AXIS_JOYSTICK: TwoAxisJoystickView,
    GAMEPAD: UnknownView,
    KEYPAD: UnknownView,

    // outputs
    LED: UnknownView,
    LOGGER: UnknownView,
    ENHANCED_GRAPH: EnhancedGraphView,
    DIGIT4_DISPLAY: NumericalDisplayView,
    LABELED_VALUE_DISPLAY: NumericalDisplayView,
    GAUGE: UnknownView,
    LCD_DISPLAY: UnknownView,
    GRAPH: UnknownView,
    LEVEL_DISPLAY: UnknownView,
    TERMINAL: TerminalView,

    // inputs
    MICROPHONE: UnknownView,
    GYROSCOPE: UnknownView,
    ACCELEROMETER: UnknownView,
    GPS: UnknownView,

    // notifications
    TWITTER: UnknownView,
    EMAIL: UnknownView,
    NOTIFICATION: UnknownView,

    // other
    SD_CARD: UnknownView,
    EVENTOR: UnknownView,
    RCT: UnknownView,
    BRIDGE: UnknownView,
    BLUETOOTH: UnknownView,

    // UI
    MENU: UnknownView,
};

export class Widget extends React.Component {
    renderContent() {
        const { widget } = this.props;
        const ViewComponent = WIDGET_VIEW_COMPONENTS[widget.get('type')] || UnknownView;
        return <ViewComponent widget={widget} />;
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
    return {};
}

export default connect(
    mapStateToProps,
    {},
)(Widget);
