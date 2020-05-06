import React from 'react';

import { ListContainer, RowContainer, TitleTxt, ContentTxt, MultiLineContainer, MultiLineItem } from '../style';

const List = (props: any) => {
    const { list } = props;

    return (
        <ListContainer>
            {list.map((item: any) => (
                <RowContainer key={item.title}>
                    <TitleTxt>{item.title}</TitleTxt>
                    {!item.multiline && <ContentTxt>{item.value}</ContentTxt>}
                    {item.multiline && (
                        <MultiLineContainer>
                            {item.value.map((i: any) => (
                                <MultiLineItem key={i}>{i}</MultiLineItem>
                            ))}
                        </MultiLineContainer>
                    )}
                </RowContainer>
            ))}
        </ListContainer>
    );
};

export default List;
