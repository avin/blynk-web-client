import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';

export class Widget extends React.Component {
    render() {
        const { widget } = this.props;

        const sizeFactor = 70;
        const margin = 10;

        return (
            <div
                className={styles.root}
                style={{
                    left: widget.x * sizeFactor,
                    top: widget.y * sizeFactor,
                    width: widget.width * sizeFactor - margin,
                    height: widget.height * sizeFactor - margin,
                }}
            >
                Widget
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {};
}

export default connect(
    mapStateToProps,
    {},
)(Widget);
