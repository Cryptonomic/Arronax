import React from 'react';

const accountTemplate = (props: any) => {
    const { values, attributes, formatValue, t } = props;
    return {
        title: t('components.entityModal.details', { title: 'Account' }),
        items: {
            list: [
                {
                    title: t('attributes.accounts.account_id'),
                    value: <>{formatValue(values, attributes, 'account_id')}</>,
                },
                {
                    title: t('attributes.accounts.balance'),
                    value: <>{formatValue(values, attributes, 'balance')}</>,
                },
                {
                    title: t('components.entityModal.account.last_active_title'),
                    value: (
                        <>
                            {t('components.entityModal.account.at_level', { level: formatValue(values, attributes, 'block_level') })}: &nbsp;{' '}
                            {formatValue(values, attributes, 'block_id', true)}
                        </>
                    ),
                },
                {
                    title: t(`attributes.accounts.counter`),
                    value: <>{formatValue(values, attributes, 'counter')}</>,
                },
                {
                    title: t(`attributes.accounts.delegate_value`),
                    value: <>{formatValue(values, attributes, 'delegate_value')}</>,
                },
            ],
            block: [],
        },
    };
};

export default accountTemplate;
