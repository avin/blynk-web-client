import React from 'react';
import * as d3 from 'd3';
import cn from 'clsx';
import ReactDOM from 'react-dom';
import styles from './styles.module.scss';
import ChartControl from './ChartControl/ChartControl';
import ChartLegend from './ChartLegend/ChartLegend';

export default class DataStreamsChart extends React.Component {
    originalChartDuration = 3600 * 1000 * 6;
    chartDuration = this.originalChartDuration;
    lastChartTime = 0;

    drawChart() {
        const { width, dataStreamsHistory, height, controlBlockRef, legendBlockRef, dataStreams } = this.props;

        const margin = 3;

        const svg = d3
            .select(this.containerRef)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', styles.svg);

        const chart = svg.append('g').attr('transform', `translate(0,${margin})`);

        const colors = d3.scaleOrdinal(d3.schemeCategory10);

        let maxTime = Number.MAX_SAFE_INTEGER * -1;
        let minTime = Number.MAX_SAFE_INTEGER;

        dataStreamsHistory.forEach(data => {
            const timeExtent = d3.extent(data, d => d[0]);
            minTime = Math.min(timeExtent[0], minTime);
            maxTime = Math.max(timeExtent[1], maxTime);
        });
        this.lastChartTime = maxTime;

        let xScale;
        let yScales;

        // Draw/redraw chart
        const redraw = firstDraw => {
            xScale = d3
                .scaleLinear()
                .domain([this.lastChartTime - this.chartDuration, this.lastChartTime])
                .range([0, width]);

            yScales = {};

            // Generate yScales for dataStreams
            dataStreamsHistory.forEach((data, dataIdx) => {
                yScales[dataIdx] = d3
                    .scaleLinear()
                    .domain(d3.extent(data, d => d[1]))
                    .range([height - margin, margin]);
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
                        .attr('transform', `translate(${30 + 30 * axisOrder}, ${20})`);
                } else {
                    axis = chart.select(`.leftAxis${dataIdx}`);
                }

                axis.call(leftAxis)
                    .call(axis => axis.select('.domain').remove())
                    .call(axis => axis.selectAll('line').remove())
                    .call(axis => axis.selectAll('text').attr('fill', colors(dataIdx)));

                axisOrder += 1;
            });
        };

        // Instant run first draw
        redraw(true);

        // Zoom chart action
        const zoom = d3.zoom().on('zoom', () => {
            this.chartDuration = this.originalChartDuration * (1 / d3.event.transform.k);

            svg.select('.tipGroup')
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
                startX = d3.event.x;
                svg.select('.tipGroup')
                    .transition()
                    .style('opacity', '0');
            })
            .on('end', () => {
                svg.select('.tipGroup')
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
            const tipGroup = selection.append('g').attr('class', 'tipGroup');

            tipGroup
                .append('path') // this is the black vertical line to follow mouse
                .attr('class', styles.tipMouseLine);

            dataStreams.forEach((dataStream, idx) => {
                const dataStreamTip = tipGroup.append('g').attr('class', 'dataStreamTip');

                dataStreamTip
                    .append('circle')
                    .attr('class', styles.tipCircle)
                    .attr('r', 4)
                    .style('stroke', colors(idx));
            });

            const showTipGroup = () => {
                tipGroup.style('opacity', '1');
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

                    tipGroup
                        .select(`.${styles.tipMouseLine}`)
                        .attr('d', () => d3.line()([[mouse[0], height], [mouse[0], 0]]));

                    tipGroup.selectAll(`.dataStreamTip`).attr('transform', function(d, i) {
                        const xDate = xScale.invert(mouse[0]);
                        const bisect = d3.bisector(([date]) => date).right;

                        const pointIdx = bisect(dataStreamsHistory[i], xDate);
                        const yScale = yScales[i];
                        if (dataStreamsHistory[i][pointIdx]) {
                            const y = yScale(dataStreamsHistory[i][pointIdx][1]);
                            return `translate(${mouse[0]},${y})`;
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
        ReactDOM.render(<ChartControl onChangeDuration={handleChangeDuration} />, controlBlockRef);
        ReactDOM.render(
            <ChartLegend onChangeDuration={handleChangeDuration} colorScale={colors} dataStreams={dataStreams} />,
            legendBlockRef,
        );
    }

    componentDidMount() {
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
