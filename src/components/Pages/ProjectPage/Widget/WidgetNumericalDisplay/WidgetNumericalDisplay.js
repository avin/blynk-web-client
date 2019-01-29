import React from 'react';
import styles from './styles.module.scss';
import { numToCssColor } from '../../../../../utils/color';

export default class WidgetNumericalDisplay extends React.Component {
    renderValue() {
        const { value } = this.props;

        let valueStr;
        if (isNaN(Number(value))) {
            valueStr = value;
        } else {
            valueStr = parseFloat(Number(value).toFixed(2));
        }

        return <span>{valueStr}</span>;
    }

    render() {
        const { widget } = this.props;

        return (
            <div>
                <div className={styles.label}>{widget.get('label')}</div>
                <div className={styles.value} style={{ color: numToCssColor(widget.get('color')) }}>
                    {this.renderValue()}
                </div>
            </div>
        );
    }
}
