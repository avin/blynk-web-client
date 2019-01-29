import React from 'react';
import ColorPicker from 'coloreact';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import styles from './styles.module.scss';

export default class RgbView extends React.Component {
    handleChangeColor = color => {};

    render() {
        const { widget } = this.props;

        return (
            <>
                <WidgetLabel title={widget.get('label') || 'ZerGBA'} />
                <div className={styles.colorPickerContainer}>
                    <ColorPicker opacity={false} color="#408fa3" onChange={this.handleChangeColor} />
                </div>
            </>
        );
    }
}
