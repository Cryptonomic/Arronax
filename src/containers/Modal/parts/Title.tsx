import React from 'react';

import {
    ModalTitle,
    TitleWrapper,
} from '../style';

const Title = (props: any) => {
    const { title } = props;

    return (
        <TitleWrapper>
            <ModalTitle>{title}</ModalTitle>
        </TitleWrapper>
    );
};

export default Title;
