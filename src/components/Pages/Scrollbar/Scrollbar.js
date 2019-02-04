import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import cn from 'clsx';
import styles from './styles.module.scss';

export default class Scrollbar extends Component {
    static defaultProps = {
        scrollRef: () => {},
    };

    renderThumb = ({ className, style, ...props }) => {
        return <div className={cn(className, styles.thumb)} style={style} {...props} />;
    };

    render() {
        const { scrollRef, ...props } = this.props;

        return (
            <Scrollbars
                renderThumbHorizontal={this.renderThumb}
                renderThumbVertical={this.renderThumb}
                ref={i => scrollRef(i)}
                {...props}
            />
        );
    }
}
