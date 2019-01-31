import React from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';
import styles from './styles.module.scss';

export default class ChartControl extends React.Component {
    handleSelectDuration = e => {
        const { onChangeDuration } = this.props;
        onChangeDuration(Number(e.currentTarget.dataset.duration));
    };

    render() {
        return (
            <div className={styles.control}>
                <ButtonGroup style={{ minWidth: 150 }} fill>
                    {[
                        ['1h', 3600 * 1000],
                        ['6h', 3600 * 1000 * 6],
                        ['12h', 3600 * 1000 * 12],
                        ['1d', 3600 * 1000 * 24],
                        ['3d', 3600 * 1000 * 24 * 3],
                    ].map(([label, duration]) => (
                        <Button key={label} onClick={this.handleSelectDuration} data-duration={duration} small>
                            {label}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>
        );
    }
}
