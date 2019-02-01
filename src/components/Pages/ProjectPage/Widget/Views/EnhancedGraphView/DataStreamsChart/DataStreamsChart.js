import React from 'react';
import * as d3 from 'd3';
import cn from 'clsx';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import * as Immutable from 'immutable';
import chroma from 'chroma-js';
import styles from './styles.module.scss';
import ChartControl from './ChartControl/ChartControl';
import ChartLegend from './ChartLegend/ChartLegend';

export default class DataStreamsChart extends React.Component {
    static propTypes = {
        showXAxis: PropTypes.bool,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        controlBlockRef: PropTypes.instanceOf(Element),
        legendBlockRef: PropTypes.instanceOf(Element),
        dataStreams: PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.instanceOf(Immutable.Iterable)])
            .isRequired,
        dataStreamsHistory: PropTypes.oneOfType([PropTypes.instanceOf(Array), PropTypes.instanceOf(Immutable.Iterable)])
            .isRequired,
    };

    originalChartDuration = 3600 * 1000 * 6;
    chartDuration = this.originalChartDuration;
    lastChartTime = 0;

    drawChart() {
        const {
            width,
            dataStreamsHistory,
            height,
            controlBlockRef,
            legendBlockRef,
            dataStreams,
            showXAxis,
        } = this.props;

        const margin = 3;
        const tipTimeWidth = 125;

        const showXAxisMargin = showXAxis ? 30 : 23;

        const svg = d3
            .select(this.containerRef)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', styles.svg);

        const chart = svg.append('g').attr('transform', `translate(0,${margin - showXAxisMargin})`);

        const colors = d3.scaleOrdinal(d3.schemeCategory10);

        let maxTime = Number.MAX_SAFE_INTEGER * -1;
        let minTime = Number.MAX_SAFE_INTEGER;

        dataStreamsHistory.forEach(data => {
            const timeExtent = d3.extent(data, d => d[0]);
            minTime = Math.min(timeExtent[0], minTime);
            maxTime = Math.max(timeExtent[1], maxTime);
        });
        this.lastChartTime = maxTime;

        const tipTimeFormat = d3.timeFormat('%Y-%m-%d %H:%M:%S');

        let dragging = false;
        let xScale;
        let yScales;
        let xAxisScale;

        // Draw/redraw chart
        const redraw = firstDraw => {
            xScale = d3
                .scaleLinear()
                .domain([this.lastChartTime - this.chartDuration, this.lastChartTime])
                .range([0, width]);

            xAxisScale = d3
                .scaleTime()
                .domain([new Date(this.lastChartTime - this.chartDuration), new Date(this.lastChartTime)])
                .range([0, width]);

            yScales = {};

            // Generate yScales for dataStreams
            dataStreamsHistory.forEach((data, dataIdx) => {
                yScales[dataIdx] = d3
                    .scaleLinear()
                    .domain(d3.extent(data, d => d[1]))
                    .range([height - margin, margin + showXAxisMargin]);
            });

            // Draw lines for dataStreams
            dataStreamsHistory.forEach((data, dataIdx) => {
                const yScale = yScales[dataIdx];

                const line = d3
                    .line()
                    .x(([time]) => xScale(time))
                    .y(([time, value]) => yScale(value));

                let path;
                if (firstDraw) {
                    path = chart.append('path').attr('class', cn(styles.chartLine, `path${dataIdx}`));
                } else {
                    path = chart.select(`.path${dataIdx}`);
                }

                path.datum(data)
                    .attr('d', line)
                    .attr('stroke', colors(dataIdx));
            });

            // Draw axises for dataStreams
            let axisOrder = 0;
            dataStreamsHistory.forEach((data, dataIdx) => {
                if (!dataStreams.getIn([dataIdx, 'showYAxis'])) {
                    return;
                }

                const yScale = yScales[dataIdx];

                const leftAxis = d3.axisLeft(yScale);

                let axis;
                if (firstDraw) {
                    axis = chart
                        .append('g')
                        .attr('class', cn(styles.leftAxis, `leftAxis${dataIdx}`))
                        .attr('transform', `translate(${30 + 30 * axisOrder}, 0)`);
                } else {
                    axis = chart.select(`.leftAxis${dataIdx}`);
                }

                axis.call(leftAxis)
                    .call(axis => axis.select('.domain').remove())
                    .call(axis => axis.selectAll('line').remove())
                    .call(axis =>
                        axis.selectAll('text').attr(
                            'fill',
                            chroma(colors(dataIdx))
                                .brighten(0.8)
                                .css(),
                        ),
                    );

                axisOrder += 1;
            });

            // Draw time(x) axis
            if (showXAxis) {
                let axis;
                if (firstDraw) {
                    axis = chart
                        .append('g')
                        .attr('class', 'timeAxis')
                        .attr('transform', `translate(0, ${height + margin})`);
                } else {
                    axis = chart.select('.timeAxis');
                }

                axis.call(d3.axisBottom(xAxisScale));
            }
        };

        // Instant run first draw
        redraw(true);

        // Zoom chart action
        const zoom = d3.zoom().on('zoom', () => {
            this.chartDuration = this.originalChartDuration * (1 / d3.event.transform.k);

            chart
                .select('.tipGroup')
                .transition()
                .style('opacity', '0');

            redraw();
        });

        // Drag chart actions
        let startX;
        const drag = d3
            .drag()
            .clickDistance(10)
            .on('start', () => {
                dragging = true;
                startX = d3.event.x;
                chart
                    .select('.tipGroup')
                    .transition()
                    .style('opacity', '0');
            })
            .on('end', () => {
                dragging = false;
                chart
                    .select('.tipGroup')
                    .transition()
                    .style('opacity', '1');
            })
            .on('drag', () => {
                const diff = d3.event.x - startX;

                if (diff < -10 || diff > 10) {
                    startX = d3.event.x;

                    const timeDiff = (this.chartDuration / width) * diff;

                    this.lastChartTime -= timeDiff;
                    this.lastChartTime = Math.min(maxTime + this.chartDuration / 5, this.lastChartTime);
                    this.lastChartTime = Math.max(minTime + this.chartDuration / 2, this.lastChartTime);

                    redraw();
                }
            });

        // Mouse over tooltips
        const mouseTip = selection => {
            const tipGroup = chart
                .append('g')
                .attr('class', 'tipGroup')
                .style('opacity', '0');

            tipGroup
                .append('path') // this is the black vertical line to follow mouse
                .attr('class', cn('tipMouseLine', styles.tipMouseLine));

            const tipTime = tipGroup.append('g').attr('class', cn('tipTime', styles.tipTime));
            tipTime
                .append('rect')
                .attr('class', cn('tipTimeRect', styles.tipTimeRect))
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', tipTimeWidth)
                .attr('height', 15);

            tipTime
                .append('text')
                .attr('class', 'tipTimeText')
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${tipTimeWidth / 2},12)`);

            dataStreams.forEach((dataStream, idx) => {
                const dataStreamTip = tipGroup.append('g').attr('class', 'dataStreamTip');

                dataStreamTip
                    .append('circle')
                    .attr('class', cn('tipCircle', styles.tipCircle))
                    .attr('r', 4)
                    .style('stroke', colors(idx));

                dataStreamTip.append('text').attr('class', cn('tipText', styles.tipText));
            });

            const showTipGroup = () => {
                if (!dragging) {
                    tipGroup.style('opacity', '1');
                }
            };

            const hideTipGroup = () => {
                tipGroup.style('opacity', '0');
            };

            return selection
                .on('mouseover', () => {
                    showTipGroup();
                })
                .on('mouseout', () => {
                    hideTipGroup();
                })
                .on('mousemove', function(d, idx, els) {
                    const mouse = d3.mouse(selection.node());
                    const xDate = xScale.invert(mouse[0]);

                    // Draw tooltip vertical line
                    tipGroup
                        .select(`.tipMouseLine`)
                        .attr('d', () => d3.line()([[mouse[0], height + margin], [mouse[0], 0]]));

                    svg.select('.tipTime').attr(
                        'transform',
                        `translate(${mouse[0] - tipTimeWidth / 2},${height + margin})`,
                    );
                    svg.select('.tipTimeText').text(tipTimeFormat(xDate));

                    // Move tooltip on lines
                    tipGroup.selectAll(`.dataStreamTip`).each((item, idx, els) => {
                        const bisect = d3.bisector(([date]) => date).right;

                        const pointIdx = bisect(dataStreamsHistory[idx], xDate);
                        const yScale = yScales[idx];

                        if (dataStreamsHistory[idx][pointIdx]) {
                            const y = yScale(dataStreamsHistory[idx][pointIdx][1]);
                            d3.select(els[idx]).attr('transform', `translate(${mouse[0]},${y})`);
                            const value = parseFloat(Number(dataStreamsHistory[idx][pointIdx][1]).toFixed(1));
                            d3.select(els[idx])
                                .select('text')
                                .text(value);
                        } else {
                            d3.select(els[idx]).attr('transform', `translate(-999,-999)`);
                        }
                    });
                });
        };

        // Apply behavior handlers
        svg.call(drag)
            .call(zoom)
            .call(mouseTip);

        const handleChangeDuration = duration => {
            this.originalChartDuration = duration;
            this.chartDuration = duration;
            svg.call(zoom.transform, d3.zoomIdentity);
            redraw();
        };

        // Mount chart controls to ref
        if (controlBlockRef) {
            ReactDOM.render(<ChartControl onChangeDuration={handleChangeDuration} />, controlBlockRef);
        }

        // Mount chart legend to ref
        if (legendBlockRef) {
            ReactDOM.render(
                <ChartLegend onChangeDuration={handleChangeDuration} colorScale={colors} dataStreams={dataStreams} />,
                legendBlockRef,
            );
        }
    }

    async componentDidMount() {
        this.drawChart();
    }

    render() {
        const { width, height } = this.props;

        return (
            <div
                className={styles.chartContainer}
                style={{ width, height }}
                ref={i => {
                    this.containerRef = i;
                }}
            />
        );
    }
}
