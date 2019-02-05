import { connect } from 'react-redux';
import { pinValueSelector } from '../../../../../../redux/selectors';

import { SliderView } from '../SliderView/SliderView';

export class VerticalSliderView extends SliderView {
    static defaultProps = {
        vertical: true,
    };
}

function mapStateToProps(state, ownProps) {
    const deviceId = ownProps.widget.get('deviceId');
    const pinId = ownProps.widget.get('pinId');
    return {
        value: pinValueSelector(state, deviceId, pinId),
    };
}

export default connect(
    mapStateToProps,
    {},
)(VerticalSliderView);
