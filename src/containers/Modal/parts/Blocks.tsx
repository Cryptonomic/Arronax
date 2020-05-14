import React from 'react';

import { BottomRowContainer, BottomCol, BottomColTitle, BottomColContent } from '../style';

const Blocks = (props: any) => {
    const { blocks } = props;

    return (
        <BottomRowContainer>
            {blocks.map((item: any) => (
                <BottomCol key={item.title}>
                    <BottomColTitle>{item.title}</BottomColTitle>
                    <BottomColContent>{item.value}</BottomColContent>
                </BottomCol>
            ))}
        </BottomRowContainer>
    );
};

export default Blocks;
