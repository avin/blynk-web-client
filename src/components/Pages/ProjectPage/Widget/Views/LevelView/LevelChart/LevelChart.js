import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import cn from 'clsx';
import styles from './styles.module.scss';

export class LevelChart extends React.Component {
    static propTypes = {
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        vertical: PropTypes.bool,
        flipAxis: PropTypes.bool,
    };

    renderChart() {
        const { width, height } = this.props;

        const svg = d3
            .select(this.containerRef)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const chart = svg.append('g');

        chart
            .append('rect')
            .attr('class', cn('backLine', styles.backLine))
            .attr('x', 0)
            .attr('y', 0)
            .attr('rx', 3)
            .attr('ry', 3)
            .attr('width', width)
            .attr('height', height);
        chart
            .append('rect')
            .attr('class', cn('frontLine', styles.frontLine))
            .attr('rx', 3)
            .attr('ry', 3)
            .attr('x', 0)
            .attr('y', 0);

        this.redraw = () => {
            const { min, max, value, height, width, vertical, flipAxis } = this.props;
            const fillFactor = value / (max - min);

            const frontLine = chart.select('.frontLine').attr('opacity', fillFactor ? 1 : 0);

            if (vertical) {
                frontLine.attr('height', Math.max(fillFactor * height, 0)).attr('width', width);
                if (!flipAxis) {
                    frontLine.attr('y', Math.max(height - fillFactor * height, 0));
                }
            } else {
                frontLine.attr('width', Math.max(fillFactor * width, 0)).attr('height', height);
                if (flipAxis) {
                    frontLine.attr('x', Math.max(width - fillFactor * width, 0));
                }
            }
        };
        this.redraw();
    }

    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.redraw && this.redraw();
    }

    render() {
        return (
            <div
                ref={i => {
                    this.containerRef = i;
                }}
            />
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {};
}

export default connect(
    mapStateToProps,
    {},
)(LevelChart);
