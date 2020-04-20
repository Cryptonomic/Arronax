import { getNoEmptyFields } from '../../../utils/attributes';

const blockOperationsTemplate = (props: any) => {
    const {
        attributes,
        formatValue,
        t,
        modules: { blockOperations },
    } = props;

    const opsColsName = (cols: string[]) => {
        return cols.map((col) => {
            return {
                name: col,
                displayName: t(`attributes.operations.${col}`),
            };
        });
    };

    const opsItems = (cols: { name: string }[]) => {
        return blockOperations.map((item: any) => {
            const newItem = { ...item };
            const opsValues = getNoEmptyFields(attributes, item);
            cols.map((col: { name: string }) => {
                if (col.name === 'kind') return (newItem[col.name] = newItem[col.name].slice(0, 1).toLocaleUpperCase().concat(newItem[col.name].slice(1)));
                return (newItem[col.name] = formatValue(opsValues, attributes, col.name, true));
            });
            return newItem;
        });
    };

    const cols = opsColsName(['kind', 'amount', 'fee', 'operation_group_hash', 'source', 'destination', 'parameters']);
    const items = opsItems(cols);
    return {
        title: t('components.entityModal.details', { title: 'Block' }),
        cols,
        items,
    };
};

export default blockOperationsTemplate;
