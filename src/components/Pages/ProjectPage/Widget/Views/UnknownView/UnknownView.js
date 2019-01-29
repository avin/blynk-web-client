import React from 'react';

export default class UnknownView extends React.Component {
    render() {
        const { widget } = this.props;
        return (
            <div>
                <b>UNKNOWN!</b> {widget.get('type')}
            </div>
        );
    }
}
