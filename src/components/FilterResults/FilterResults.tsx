import React from 'react';
import { useSelector } from 'react-redux';

import { Container } from './styles';
import { formatQueryForNaturalLanguage } from '../../utils/render';

import { FilterResultsProps } from './types';

const FilterResults = () => {
    const queryFilters = useSelector(({ app }: FilterResultsProps) => app.queryFilters);
    const selectedConfig = useSelector(({ app }: FilterResultsProps) => app.selectedConfig);
    const selectedEntity = useSelector(({ app }: FilterResultsProps) => app.selectedEntity);
    const { platform, network } = selectedConfig;
    let result: string | React.ReactElement = '';

    if (queryFilters && queryFilters.predicates && queryFilters.predicates.length) {
        result = formatQueryForNaturalLanguage(platform, network, selectedEntity, queryFilters);
    }

    return <Container>{result}</Container>;
};

export default FilterResults;
