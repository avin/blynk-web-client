import React from 'react';
import { connect } from 'react-redux';
import SizeMe from '@avinlab/react-size-me';
import WidgetLabel from '../../WidgetLabel/WidgetLabel';
import styles from './styles.module.scss';
import { pinValueSelector } from '../../../../../../redux/selectors';

export class ImageView extends React.Component {
    render() {
        const { widget, value } = this.props;

        let imageUrl;
        if (widget.get('urls')) {
            if (value >= 1 && value <= widget.get('urls').size) {
                imageUrl = widget.getIn(['urls', value - 1]);
            } else {
                imageUrl = widget.getIn(['urls', 0]);
            }
        }

        return (
            <>
                <WidgetLabel title={widget.get('label')} />
                <div className={styles.imageContainer}>
                    {imageUrl && (
                        <SizeMe>
                            {({ width, height }) => {
                                let imgWidth;
                                let imgHeight;
                                if (widget.get('scaling') === 'FIT') {
                                    imgWidth = Math.min(width, height);
                                    imgHeight = Math.min(width, height);
                                } else {
                                    imgWidth = width;
                                    imgHeight = height;
                                }

                                return <img src={imageUrl} alt={value} width={imgWidth} height={imgHeight} />;
                            }}
                        </SizeMe>
                    )}
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
)(ImageView);
