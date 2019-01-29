import React from 'react';

export default class WidgetUnknown extends React.Component {
    render() {
        const { widget } = this.props;
        return (
            <div>
                <b>UNKNOWN!</b> {widget.type}
            </div>
        );
    }
}
