import React from 'react';
import { connect } from 'react-redux';
import { Button, InputGroup } from '@blueprintjs/core';
import trim from 'lodash/trim';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import styles from './styles.module.scss';
import { pinValueSelector } from '../../../../../../redux/selectors';
import blynkWSClient from '../../../../../../common/blynkWSClient';
import { getWidgetPinAddress } from '../../../../../../utils/data';

export class TextInputView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            inputValue: props.value,
        };
    }

    handleChangeValue = e => {
        this.setState({
            inputValue: e.currentTarget.value,
        });
    };

    handleKeyPress = e => {
        const keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.currentTarget.blur();
        }
    };

    handleBlur = () => {
        const { widget } = this.props;
        const inputValue = Number(this.state.inputValue) || widget.get('min', 0);

        const pin = getWidgetPinAddress(widget);
        if (pin !== -1) {
            blynkWSClient(widget.get('deviceId')).sendWritePin(pin, inputValue);
        }
    };

    handleConfirmButtonClick = e => {
        e.currentTarget.blur();
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.value !== this.props.value) {
            this.setState({
                inputValue: this.props.value,
            });
        }
    }

    get isNumberInput() {
        const { widget } = this.props;
        return widget.get('type') === 'NUMBER_INPUT';
    }

    handleClickPlusMinus = e => {
        const { widget } = this.props;
        const { action } = e.currentTarget.dataset;
        const { inputValue } = this.state;

        const step = widget.get('step', 1);
        const min = widget.get('min', 0);
        const max = widget.get('max', 0);
        const isLoopOn = widget.get('isLoopOn', false);

        let resultValue = Number(inputValue) + (action === 'plus' ? +step : -step) || min;
        if (resultValue > max) {
            if (isLoopOn) {
                resultValue = min;
            } else {
                resultValue = max;
            }
        } else if (resultValue < min) {
            if (isLoopOn) {
                resultValue = max;
            } else {
                resultValue = min;
            }
        }

        this.setState(
            {
                inputValue: resultValue,
            },
            () => {
                this.handleBlur();
            },
        );
    };

    render() {
        const { widget } = this.props;
        const { inputValue } = this.state;
        const { isNumberInput } = this;

        const suffix = trim(widget.get('suffix', ''));

        let rightElement;
        let leftElement;
        if (isNumberInput) {
            leftElement = (
                <Button
                    icon="minus"
                    onClick={this.handleClickPlusMinus}
                    data-action="minus"
                    className={styles.controlButton}
                />
            );
            rightElement = (
                <Button
                    icon="plus"
                    onClick={this.handleClickPlusMinus}
                    data-action="plus"
                    className={styles.controlButton}
                />
            );
        } else {
            rightElement = (
                <Button
                    icon="key-enter"
                    minimal
                    onClick={this.handleConfirmButtonClick}
                    className={styles.controlButton}
                />
            );
        }

        return (
            <>
                <WidgetLabel title={trim(widget.get('label', '') + (suffix ? ` (${suffix})` : ''))} />
                <div className={styles.container}>
                    <InputGroup
                        placeholder={widget.get('hint')}
                        value={inputValue}
                        onChange={this.handleChangeValue}
                        onKeyPress={this.handleKeyPress}
                        onBlur={this.handleBlur}
                        leftIcon={leftElement}
                        rightElement={rightElement}
                        style={{
                            textAlign: isNumberInput ? 'center' : undefined,
                        }}
                    />
                </div>
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const deviceId = ownProps.widget.get('deviceId');
    const pinId = ownProps.widget.get('pinId');
    return {
        value: pinValueSelector(state, deviceId, pinId) || 0,
    };
}

export default connect(
    mapStateToProps,
    {},
)(TextInputView);
