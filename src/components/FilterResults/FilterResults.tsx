import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { Container } from './styles';
import { formatQueryForNaturalLanguage } from '../../utils/render';

import { FilterResultsProps } from './types';

const FilterResults = () => {
    const queryFilters = useSelector(({ app }: FilterResultsProps) => app.queryFilters, shallowEqual);
    const selectedConfig = useSelector(({ app }: FilterResultsProps) => app.selectedConfig, shallowEqual);
    const selectedEntityKey = useSelector(({ app }: FilterResultsProps) => app.selectedEntity, shallowEqual);
    const attributes: any = useSelector(({ app }: FilterResultsProps) => app.attributes, shallowEqual);
    const entities = useSelector(({ app }: FilterResultsProps) => app.entities, shallowEqual);
    const operators = useSelector(({ app }: FilterResultsProps) => app.operators, shallowEqual);

    const { platform, network } = selectedConfig;
    const selectedEntity = (entities.filter(e => e.name === selectedEntityKey)[0]).displayNamePlural;

    let result: string | React.ReactElement = '';

    if (queryFilters[selectedEntityKey] && queryFilters[selectedEntityKey].predicates && queryFilters[selectedEntityKey].predicates.length) {
        result = formatQueryForNaturalLanguage(platform, network, selectedEntity, queryFilters[selectedEntityKey], attributes[selectedEntityKey], operators);
    }
    return <Container>{result}</Container>;
};

export default FilterResults;
