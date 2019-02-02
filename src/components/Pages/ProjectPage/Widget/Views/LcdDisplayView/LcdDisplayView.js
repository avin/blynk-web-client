import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { pinValueSelector } from '../../../../../../redux/selectors';

export class LcdDisplayView extends React.Component {
    renderValue(pinIdx) {
        const { value1, value2, widget } = this.props;

        const value = pinIdx === 1 ? value1 : value2;

        let valueStr;
        if (isNaN(Number(value))) {
            valueStr = value;
        } else {
            valueStr = parseFloat(Number(value).toFixed(2));
        }

        const valueFormatting = widget.get(`textFormatLine${pinIdx}`);
        if (valueFormatting) {
            valueStr = valueFormatting.replace(new RegExp(`/pin${pinIdx - 1}/`, 'gi'), valueStr);
        }

        return <span>{valueStr}</span>;
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
    const pin1Id = ownProps.widget.getIn(['pins', 0, 'pinId']);
    const pin2Id = ownProps.widget.getIn(['pins', 1, 'pinId']);
    return {
        value1: pinValueSelector(state, pin1Id),
        value2: pinValueSelector(state, pin2Id),
    };
}

export default connect(
    mapStateToProps,
    {},
)(LcdDisplayView);
