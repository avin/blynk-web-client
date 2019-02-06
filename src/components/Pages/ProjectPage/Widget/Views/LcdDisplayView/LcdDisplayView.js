import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { pinValueSelector } from '../../../../../../redux/selectors';
import { formatValueString } from '../../../../../../utils/data';

export class LcdDisplayView extends React.Component {
    renderValue(pinIdx) {
        const { value1, value2, widget } = this.props;

        const value = pinIdx === 1 ? value1 : value2;

        return (
            <span
                dangerouslySetInnerHTML={{
                    __html: formatValueString(value, widget.get(`textFormatLine${pinIdx}`), `pin${pinIdx}`),
                }}
            />
        );
    }

    render() {
        return (
            <div>
                <div className={styles.value}>
                    <div className={styles.line}>{this.renderValue(1)}</div>
                    <div className={styles.line}>{this.renderValue(2)}</div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const deviceId = ownProps.widget.get('deviceId');
    const pin1Id = ownProps.widget.getIn(['pins', 0, 'pinId']);
    const pin2Id = ownProps.widget.getIn(['pins', 1, 'pinId']);
    return {
        value1: pinValueSelector(state, deviceId, pin1Id),
        value2: pinValueSelector(state, deviceId, pin2Id),
    };
}

export default connect(
    mapStateToProps,
    {},
)(LcdDisplayView);
