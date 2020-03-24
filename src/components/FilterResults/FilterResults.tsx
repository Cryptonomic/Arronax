import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Container } from './styles';
import { formatQueryForNaturalLanguage } from '../../utils/render';

import { FilterResultsProps } from './types';

const FilterResults = () => {
    const queryFilters = useSelector(({ app }: FilterResultsProps) => app.queryFilters, shallowEqual);
    const selectedConfig = useSelector(({ app }: FilterResultsProps) => app.selectedConfig, shallowEqual);
    const selectedEntity = useSelector(({ app }: FilterResultsProps) => app.selectedEntity, shallowEqual);
    const { platform, network } = selectedConfig;
    let result: string | React.ReactElement = '';

    if (queryFilters[selectedEntity] && queryFilters[selectedEntity].predicates && queryFilters[selectedEntity].predicates.length) {
        result = formatQueryForNaturalLanguage(platform, network, selectedEntity, queryFilters);
    }
    return <Container>{result}</Container>;
};

export default FilterResults;
