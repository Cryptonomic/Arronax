import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { TabsWrapper, TabWrapper, IconWrapper } from './styles';

import { TabsProps } from './types';

const Tabs = (props: TabsProps) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const { t } = useTranslation();
    const { full, short, selected, onChange } = props;
    let tabs: string[] = (!short.length && full.slice(0, 3)) || short;

    useEffect(() => {
        if (!short.includes(selected)) {
            setExpanded(true);
        }
    }, [selected, short]);

    const changeHandler = (val: string) => {
        if (val === selected) {
            return;
        }
        if (val === 'more') {
            setExpanded((prevState: any) => !prevState.expanded);
            return;
        }
        onChange(val);
    };

    if (expanded) {
        tabs = full;
    }

    return (
        <TabsWrapper value={selected} scrollButtons="on" variant={expanded ? 'scrollable' : 'standard'} onChange={(e, newValue) => changeHandler(newValue)}>
            {tabs.map((tab: string, index: number) => (
                <TabWrapper key={index} value={tab} label={t(`containers.arronax.${tab}`)} />
            ))}
            {!expanded && (
                <TabWrapper
                    value="more"
                    icon={
                        <IconWrapper>
                            <span>More</span>
                            <NavigateNextIcon fontSize="small" />
                        </IconWrapper>
                    }
                />
            )}
        </TabsWrapper>
    );
};

export default Tabs;
