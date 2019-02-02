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
import LcdDisplayView from './Views/LcdDisplayView/LcdDisplayView';
import GaugeView from './Views/GaugeView/GaugeView';
import LevelView from './Views/LevelView/LevelView';
import StepView from './Views/StepView/StepView';
import LedView from './Views/LedView/LedView';

const WIDGET_VIEW_COMPONENTS = {
    BUTTON: ButtonView,
    SLIDER: SliderView,
    VERTICAL_SLIDER: VerticalSliderView,
    RGB: RgbView,
    TWO_AXIS_JOYSTICK: TwoAxisJoystickView,
    ENHANCED_GRAPH: EnhancedGraphView,
    DIGIT4_DISPLAY: NumericalDisplayView,
    LABELED_VALUE_DISPLAY: NumericalDisplayView,
    GAUGE: GaugeView,
    LCD: LcdDisplayView,
    LEVEL_DISPLAY: LevelView,
    VERTICAL_LEVEL_DISPLAY: LevelView,
    TERMINAL: TerminalView,
    STEP: StepView,
    VERTICAL_STEP: StepView,
    LED: LedView,
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
