import React from 'react';
import { connect } from 'react-redux';
import cn from 'clsx';
import SizeMe from '@avinlab/react-size-me';
import styles from './styles.module.scss';
import { setActiveTabId } from '../../../../../../redux/modules/blynk/actions';
import Scrollbar from '../../../../Scrollbar/Scrollbar';

export class TabsView extends React.Component {
    handleClickTab = e => {
        const { setActiveTabId } = this.props;
        const tabId = Number(e.currentTarget.dataset.tabId);
        setActiveTabId(tabId);
    };

    render() {
        const { widget, activeTabId } = this.props;

        return (
            <div className={styles.tabsContainer}>
                <SizeMe>
                    {({ width, height }) => (
                        <Scrollbar style={{ width, height }}>
                            <div className={styles.tabsInner}>
                                <ul className={styles.tabList}>
                                    {widget.get('tabs').map((tab, idx) => (
                                        <li
                                            key={idx}
                                            className={cn(styles.tab, { [styles.activeTab]: idx === activeTabId })}
                                            onClick={this.handleClickTab}
                                            data-tab-id={idx}
                                        >
                                            {tab.get('label') || `Tab ${idx + 1}`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Scrollbar>
                    )}
                </SizeMe>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        activeTabId: state.blynk.get('activeTabId'),
    };
}

export default connect(
    mapStateToProps,
    {
        setActiveTabId,
    },
)(TabsView);
