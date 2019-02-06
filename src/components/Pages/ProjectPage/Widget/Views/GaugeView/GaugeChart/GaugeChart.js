import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import cn from 'clsx';
import styles from './styles.module.scss';
import { decodeBlynkColor } from '../../../../../../../utils/color';
import { formatValueString } from '../../../../../../../utils/data';

export class GaugeChart extends React.Component {
    static propTypes = {
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        color: PropTypes.number,
    };

    renderChart() {
        const { width, height, min, max, color } = this.props;

        const svg = d3
            .select(this.containerRef)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const chart = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 1.5})`);

        const thickness = 20;
        const radius = Math.min(width, height) / 1.5 - thickness / 2;

        const arc = d3.arc().cornerRadius(thickness / 2);

        chart
            .append('path')
            .attr('class', cn('backLine', styles.backLine))
            .attr(
                'd',
                arc({
                    innerRadius: radius - thickness,
                    outerRadius: radius,
                    startAngle: -Math.PI / 1.5,
                    endAngle: Math.PI / 1.5,
                }),
            );
        chart
            .append('path')
            .attr('class', cn('frontLine', styles.frontLine))
            .attr('fill', decodeBlynkColor(color));
        chart
            .append('foreignObject')
            .attr('width', radius)
            .attr('height', 50)
            .attr('x', -radius / 2)
            .attr('y', -25)
            .append('xhtml:div')
            .attr('class', cn('value', styles.value))
            .style('color', decodeBlynkColor(color));

        chart
            .append('text')
            .attr('class', cn('minLabel', styles.minLabel))
            .attr('x', radius * Math.sin(-Math.PI / 1.5) + thickness)
            .attr('y', radius * Math.cos(-Math.PI / 1.5) * -1 - 5)
            .text(min);
        chart
            .append('text')
            .attr('class', cn('maxLabel', styles.maxLabel))
            .attr('x', radius * Math.sin(Math.PI / 1.5) - thickness)
            .attr('y', radius * Math.cos(Math.PI / 1.5) * -1 - 5)
            .text(max);

        this.redraw = () => {
            const { min, max, value, valueFormatting } = this.props;
            const fillFactor = value / (max - min);

            chart
                .select('.frontLine')
                .attr('opacity', fillFactor ? 1 : 0)
                .attr(
                    'd',
                    arc({
                        innerRadius: radius - thickness,
                        outerRadius: radius,
                        startAngle: -Math.PI / 1.5,
                        endAngle: Math.PI / 1.5 - Math.PI * (1.33 * (1 - fillFactor)),
                    }),
                );

            chart.select('.value').html(formatValueString(value, valueFormatting));
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
)(GaugeChart);
