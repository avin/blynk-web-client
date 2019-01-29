import React from 'react';
import styles from './styles.module.scss';
import { numToCssColor } from '../../../../../../utils/color';

export default class NumericalDisplayView extends React.Component {
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

        let fontSize;
        if (widget.get('fontSize') === 'LARGE') {
            fontSize = `20px`;
        } else if (widget.get('fontSize') === 'SMALL') {
            fontSize = `14px`;
        }

        return (
            <div>
                <div className="label">{widget.get('label')}</div>
                <div className={styles.value} style={{ color: numToCssColor(widget.get('color')), fontSize }}>
                    {this.renderValue()}
                </div>
            </div>
        );
    }
}
