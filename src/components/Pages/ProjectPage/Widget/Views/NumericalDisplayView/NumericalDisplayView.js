import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { decodeBlynkColor } from '../../../../../../utils/color';
import { pinValueSelector } from '../../../../../../redux/selectors';
import { formatValueString } from '../../../../../../utils/data';

export class NumericalDisplayView extends React.Component {
    renderValue() {
        const { value, widget } = this.props;

        return (
            <span
                dangerouslySetInnerHTML={{
                    __html: formatValueString(value, widget.get('valueFormatting')),
                }}
            />
        );
    }

    render() {
        const { widget } = this.props;

        let fontSize;
        if (widget.get('fontSize') === 'LARGE') {
            fontSize = `20px`;
        } else if (widget.get('fontSize') === 'SMALL') {
            fontSize = `14px`;
        }

        let textAlign;
        if (widget.get('textAlignment') === 'MIDDLE') {
            textAlign = 'center';
        } else if (widget.get('textAlignment') === 'RIGHT') {
            textAlign = 'right';
        }

        return (
            <div>
                <div className="label">{widget.get('label')}</div>
                <div
                    className={styles.value}
                    style={{ textAlign, color: decodeBlynkColor(widget.get('color')), fontSize }}
                >
                    {this.renderValue()}
                </div>
            </div>
        );
    }
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
)(NumericalDisplayView);
