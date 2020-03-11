import React from 'react';
import { useTranslation } from 'react-i18next';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { TabsWrapper, TabWrapper, IconWrapper } from './styles';

import { TabsProps } from './types';

const Tabs = (props: TabsProps) => {
  const { t } = useTranslation();
  const { tabs, selected, expanded, onChange } = props;
  let custom: string[] = tabs;

  if (!expanded) {
    tabs.splice(3);
  }

  return (
    <TabsWrapper
      value={selected}
      variant={expanded ? 'scrollable' : 'standard'}
      onChange={(e, newValue) => onChange(newValue)}
    >
      {custom.map((tab: string, index: number) => (
        <TabWrapper
          key={index}
          value={tab}
          label={t(`containers.arronax.${tab}`)}
        />
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
