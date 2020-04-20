const defautTemplate = (props: any) => {
    const { values, attributes, t, getRestListAttrFields } = props;

    const list = getRestListAttrFields(values, attributes);

    return {
        title: t('components.entityModal.details', { title: '' }),
        items: {
            list,
            block: [],
        },
    };
};

export default defautTemplate;
