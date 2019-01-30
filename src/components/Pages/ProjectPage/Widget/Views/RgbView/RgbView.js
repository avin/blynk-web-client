import React from 'react';
import { connect } from 'react-redux';
import ColorPicker from 'coloreact';
import chroma from 'chroma-js';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import styles from './styles.module.scss';
import { pinValueSelector } from '../../../../../../redux/selectors';
import blynkWSClient from '../../../../../../common/blynkWSClient';

export class RgbView extends React.Component {
    handleChangeColor = color => {
        const { widget } = this.props;

        const pin1Id = widget.getIn(['pins', 0, 'pinId']);
        const pin2Id = widget.getIn(['pins', 1, 'pinId']);
        const pin3Id = widget.getIn(['pins', 2, 'pinId']);

        if (pin1Id !== -1) {
            blynkWSClient.sendWritePin(pin1Id, color.rgb.r);
        }
        if (pin2Id !== -1) {
            blynkWSClient.sendWritePin(pin2Id, color.rgb.g);
        }
        if (pin3Id !== -1) {
            blynkWSClient.sendWritePin(pin3Id, color.rgb.b);
        }
    };

    render() {
        const { widget, pin1Value, pin2Value, pin3Value } = this.props;

        const color = chroma([pin1Value, pin2Value, pin3Value]).hex();

        return (
            <>
                <WidgetLabel title={widget.get('label') || 'Zergba'} />
                <div className={styles.colorPickerContainer}>
                    <ColorPicker opacity={false} color={color} onChange={this.handleChangeColor} />
                </div>
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const pin1Id = ownProps.widget.getIn(['pins', 0, 'pinId']);
    const pin2Id = ownProps.widget.getIn(['pins', 1, 'pinId']);
    const pin3Id = ownProps.widget.getIn(['pins', 2, 'pinId']);

    return {
        pin1Value: pinValueSelector(state, pin1Id),
        pin2Value: pinValueSelector(state, pin2Id),
        pin3Value: pinValueSelector(state, pin3Id),
    };
}

export default connect(
    mapStateToProps,
    {},
)(RgbView);
