import React from 'react';
import { connect } from 'react-redux';
import L from 'leaflet';
import styles from './styles.module.scss';
import { pinValueSelector } from '../../../../../../redux/selectors';

export class MapView extends React.Component {
    componentDidMount() {
        const { widget } = this.props;
        const lat = widget.get('lat');
        const lon = widget.get('lon');
        this.map = L.map(this.mapContainerRef).setView([lat, lon], 15);
        L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png').addTo(this.map);
        L.marker([lat, lon]).addTo(this.map);
    }

    render() {
        return (
            <>
                <div
                    className={styles.map}
                    style={{ height: '100%', width: '100%' }}
                    ref={i => {
                        this.mapContainerRef = i;
                    }}
                />
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
)(MapView);
