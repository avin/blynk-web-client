import { connect } from 'react-redux';
import { pinValueSelector } from '../../../../../../redux/selectors';

import { SliderView } from '../SliderView/SliderView';

export class VerticalSliderView extends SliderView {
    static defaultProps = {
        vertical: true,
    };
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
)(VerticalSliderView);
