import React from 'react';
import { connect } from 'react-redux';
import SizeMe from '@avinlab/react-size-me';
import styles from './styles.module.scss';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import { pinValueSelector } from '../../../../../../redux/selectors';
import LevelChart from './LevelChart/LevelChart';

export class LevelView extends React.Component {
    render() {
        const { widget, value } = this.props;
        const isVertical = widget.get('type') === 'VERTICAL_LEVEL_DISPLAY';

        return (
            <>
                <WidgetLabel title={widget.get('label') || (isVertical ? '' : 'Level')} information={value} />
                <div className={styles.chart}>
                    <SizeMe>
                        {({ width, height }) =>
                            !!height && (
                                <LevelChart
                                    width={width}
                                    height={height}
                                    min={widget.get('min')}
                                    max={widget.get('max')}
                                    value={Number(value)}
                                    valueFormatting={widget.get('valueFormatting')}
                                    vertical={isVertical}
                                    flipAxis={widget.get('isAxisFlipOn')}
                                />
                            )
                        }
                    </SizeMe>
                </div>
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
)(LevelView);
