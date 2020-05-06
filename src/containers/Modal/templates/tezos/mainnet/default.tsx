import React from 'react';
import { useTranslation } from 'react-i18next';

import Title from '../../../parts/Title';
import List from '../../../parts/List';

const Default = (props: any) => {
    const { t } = useTranslation();
    const { platform, network, entity, values, attributes, formatValue } = props;
    const explicitKeys: string[] = [];
    const title = t('components.entityModal.details', { title: 'Account' });
    const list = values
        .filter((v: any) => !explicitKeys.includes(v.name))
        .map((item: any) => ({
            title: t(`attributes.${item.entity}.${item.name}`),
            value: <>{formatValue(explicitKeys, platform, network, entity, values, attributes, item.name, true)}</>,
        }));

    return (
        <>
            <Title title={title} />
            <List list={list} />
        </>
    );
};

const defaultCtrl = (props: any) => {
    const actions: any = [];
    const getActions = () => actions;
    const getComponent = () => <Default {...props} />;

    return [getComponent, getActions];
};

export default defaultCtrl;
