import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import cn from 'clsx';
import styles from './styles.module.scss';

export default class Scrollbar extends Component {
    renderThumb = ({ className, style, ...props }) => {
        return <div className={cn(className, styles.thumb)} {...props} />;
    };

    render() {
        return (
            <Scrollbars
                renderThumbHorizontal={this.renderThumb}
                renderThumbVertical={this.renderThumb}
                {...this.props}
            />
        );
    }
}
