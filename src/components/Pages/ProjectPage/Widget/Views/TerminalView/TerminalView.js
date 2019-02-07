import React from 'react';
import { connect } from 'react-redux';
import { Button, InputGroup } from '@blueprintjs/core';
import cn from 'clsx';
import SizeMe from '@avinlab/react-size-me';
import { pinValueSelector } from '../../../../../../redux/selectors';
import styles from './styles.module.scss';
import Scrollbar from '../../../../Scrollbar/Scrollbar';
import { getWidgetPinAddress } from '../../../../../../utils/data';
import blynkWSClient from '../../../../../../common/blynkWSClient';

export class TerminalView extends React.Component {
    state = {
        inputValue: '',
    };

    lastOwnChange = false;

    handleSendInput = () => {
        const { widget } = this.props;
        const { inputValue } = this.state;

        const pin = getWidgetPinAddress(widget);
        if (pin !== -1) {
            this.lastOwnChange = true;
            blynkWSClient(widget.get('deviceId')).sendWritePin(pin, inputValue);
        }

        this.setState({ inputValue: '' });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.pinWriteHistory !== this.props.pinWriteHistory) {
            if (this.props.widget.get('autoScrollOn')) {
                this.scrollComponent.scrollToBottom();
            }
        }
    }

    handleChangeInput = e => {
        const inputValue = e.currentTarget.value;
        this.setState({ inputValue });
    };

    handleKeyPress = e => {
        const keyCode = e.keyCode ? e.keyCode : e.which;
        if (keyCode === 13) {
            this.handleSendInput();

            return false;
        }
    };

    generateHistoryOutput() {
        const { pinWriteHistory, widget } = this.props;
        let output = '';
        if (pinWriteHistory) {
            pinWriteHistory.forEach((historyItem, idx) => {
                if (this.lastOwnChange && idx === pinWriteHistory.size - 1) {
                    output += '> ';
                    this.lastOwnChange = false;
                }
                output += historyItem;
                if (widget.get('attachNewLine')) {
                    output += '\r\n';
                }
            });
        }
        return output;
    }

    render() {
        const { widget } = this.props;
        const { inputValue } = this.state;
        const terminalInputOn = widget.get('terminalInputOn');

        return (
            <>
                <div className={styles.outputContainer}>
                    <SizeMe>
                        {({ width, height }) => (
                            <Scrollbar
                                style={{ height, width }}
                                scrollRef={i => {
                                    this.scrollComponent = i;
                                }}
                            >
                                <pre className={cn('bp3-code-block', styles.output)}>
                                    {this.generateHistoryOutput()}
                                    !!! TERMINAL OUTPUT IS UNDER CONSTRUCTION !!!
                                </pre>
                            </Scrollbar>
                        )}
                    </SizeMe>
                </div>
                {terminalInputOn && (
                    <InputGroup
                        placeholder="Type here"
                        value={inputValue}
                        onChange={this.handleChangeInput}
                        onKeyPress={this.handleKeyPress}
                        rightElement={<Button icon="key-enter" minimal={true} onClick={this.handleSendInput} />}
                    />
                )}
            </>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const deviceId = ownProps.widget.get('deviceId');
    const pinId = ownProps.widget.get('pinId');

    return {
        value: pinValueSelector(state, deviceId, pinId),
        pinWriteHistory: state.blynk.getIn(['devices', deviceId, 'pinsWriteHistory', pinId]),
    };
}

export default connect(
    mapStateToProps,
    {},
)(TerminalView);
