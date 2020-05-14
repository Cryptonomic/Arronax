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
    const operators: any = useSelector(({ app }: FilterResultsProps) => app.operators, shallowEqual);
    let customOperators = { ...operators };

    // replace default operators
    for (let key in customOperators) {
        customOperators[key] = customOperators[key].map((o: Record<string, string>) => {
            switch (o.name) {
                case 'eq':
                    o.displayName = key === 'dateTime' ? 'at' : '';
                    break;
                case 'after':
                    o.displayName = key === 'dateTime' ? 'since' : o.displayName;
                    break;
                case 'noteq':
                    o.displayName = key === 'dateTime' ? 'excluding' : 'not';
                    break;
                default:
                    return o;
            }
            return o;
        });
    }

    const { platform, network } = selectedConfig;
    let selectedEntity = '';

    if (entities.length) {
        selectedEntity = entities.filter((e) => e.name === selectedEntityKey)[0]?.displayNamePlural;
    }

    let result: string | React.ReactElement = selectedEntity;

    if (queryFilters[selectedEntityKey]) {
        result = formatQueryForNaturalLanguage(
            platform,
            network,
            selectedEntity,
            queryFilters[selectedEntityKey],
            attributes[platform][network][selectedEntityKey],
            customOperators
        );
    }
    return <Container>{result}</Container>;
};

export default FilterResults;
