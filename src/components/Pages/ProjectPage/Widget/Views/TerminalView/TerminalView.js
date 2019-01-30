import React from 'react';
import { connect } from 'react-redux';
import { Button, InputGroup } from '@blueprintjs/core';
import cn from 'clsx';
import { pinValueSelector } from '../../../../../../redux/selectors';
import styles from './styles.module.scss';

export class TerminalView extends React.Component {
    handleSendInput = () => {};

    render() {
        return (
            <>
                <div className={styles.outputContainer}>
                    <pre className={cn('bp3-code-block', styles.output)}>
                        {`export function hasModifier(
  modifiers: ts.ModifiersArray,
  ...modifierKinds: ts.SyntaxKind[],
) {
  if (modifiers == null || modifierKinds == null) {
    return false;
  }
  return modifiers.some(m => modifierKinds.some(k => m.kind === k));
  `}
                    </pre>
                </div>
                <InputGroup
                    placeholder="..."
                    rightElement={<Button icon="key-enter" minimal={true} onClick={this.handleSendInput} />}
                />
            </>
        );
    }
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
)(TerminalView);
