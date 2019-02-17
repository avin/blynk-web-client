import React from 'react';
import { connect } from 'react-redux';
import cn from 'clsx';
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
import TabsView from './Views/TabsView/TabsView';
import EmptyView from './Views/EmptyView/EmptyView';
import MapView from './Views/MapView/MapView';
import ImageView from './Views/ImageView/ImageView';
import TextInputView from './Views/TextInputView/TextInputView';
import SegmentedControlView from './Views/SegmentedControlView/SegmentedControlView';

const WIDGET_VIEW_COMPONENTS = {
    BUTTON: ButtonView,
    STYLED_BUTTON: ButtonView,
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
    TABS: TabsView,
    EMAIL: EmptyView,
    NOTIFICATION: EmptyView,
    TWITTER: EmptyView,
    BRIDGE: EmptyView,
    RTC: EmptyView,
    MAP: MapView,
    IMAGE: ImageView,
    TEXT_INPUT: TextInputView,
    NUMBER_INPUT: TextInputView,
    SEGMENTED_CONTROL: SegmentedControlView,
};

export class Widget extends React.Component {
    renderContent() {
        const { widget } = this.props;
        const ViewComponent = WIDGET_VIEW_COMPONENTS[widget.get('type')] || UnknownView;
        return <ViewComponent widget={widget} />;
    }

    render() {
        const { widget } = this.props;

        const sizeHeightFactor = 70;
        const sizeWidthFactor = 60;
        const margin = 1;

        return (
            <div
                className={cn(styles.root, { [styles.tabsRoot]: widget.get('type') === 'TABS' })}
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
