import React from 'react';

import { formatValueWithLink } from '../../../utils/render';

const blockTemplate = (props: any) => {
    const {
        values,
        attributes,
        formatValue,
        t,
        modules: { blockOperations },
        id,
        fetchData,
        onClickItem,
        getRestListAttrFields,
    } = props;
    const template: any = {
        title: t('components.entityModal.details', { title: 'Block' }),
        items: {
            list: [
                {
                    title: t('attributes.blocks.hash'),
                    value: <>{formatValue(values, attributes, 'hash', true)}</>,
                },
                {
                    title: t('attributes.blocks.level'),
                    value: (
                        <>
                            {formatValue(values, attributes, 'level')} {t('components.entityModal.of')} {t('attributes.blocks.meta_cycle').toLowerCase()}{' '}
                            {formatValue(values, attributes, 'meta_cycle')} {t('components.entityModal.in')}{' '}
                            {t('attributes.blocks.meta_voting_period').toLowerCase()} {formatValue(values, attributes, 'meta_voting_period')}
                        </>
                    ),
                },
                {
                    title: t('attributes.blocks.baker'),
                    value: (
                        <>
                            {formatValue(values, attributes, 'baker')} {t('components.entityModal.of')} {t('attributes.blocks.priority').toLowerCase()}{' '}
                            {formatValue(values, attributes, 'priority')}
                        </>
                    ),
                },
                {
                    title: t('attributes.blocks.protocol'),
                    value: (
                        <>
                            {formatValue(values, attributes, 'proto')}: {formatValue(values, attributes, 'protocol', true)}
                        </>
                    ),
                },
                {
                    title: t('general.nouns.period'),
                    value: <>{formatValue(values, attributes, 'period_kind')}</>,
                },
            ],
            block: [],
        },
        actions: [() => fetchData('blockOperations', { id })],
    };

    if (blockOperations?.length > 0) {
        template.items.block.push({
            title: t('attributes.blocks.block_operations'),
            value: <>{formatValueWithLink({ value: blockOperations.length, onClick: () => onClickItem('block_operations') })}</>,
        });
    }

    const restListItems = getRestListAttrFields(values, attributes);

    template.items.list = [...template.items.list, ...restListItems];

    return template;
};

export default blockTemplate;
