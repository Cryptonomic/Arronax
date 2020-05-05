import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Modal from '@material-ui/core/Modal';

import { runActions } from '../../reducers/modal/thunk';
import { setModalOpen, setModalLoading, cleanModal } from '../../reducers/modal/actions';

import {
    ScrollContainer,
    ModalContainer,
} from './style';

import { getTemplate } from './controller';

export const DynamicModal = (props: any) => {
    const { onClickPrimaryKey } = props;
    const list = useSelector(({ modal }: any) => modal.list, shallowEqual);
    const isModalLoading = useSelector(({ modal }: any) => modal.isModalLoading, shallowEqual);
    const open = useSelector(({ modal }: any) => modal.open, shallowEqual);
    const attributes = useSelector(({ app }: any) => app.attributes, shallowEqual);
    const { id = '' } = useParams();
    const dispatch = useDispatch();
    const [template, setTemplate] = useState(null);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const item = list.find((item: any) => item.id === id);

        if (!item) {

        };

        const { platform, network, entity, items } = item;
        const [getComponent, getActions] = getTemplate(platform, network, entity, items[count], id, attributes)({ count, setCount, onClickPrimaryKey });

        const actions = getActions();
        setTemplate(getComponent()); //FIXME:

        if (!actions.length) {
            dispatch(setModalLoading(false));
            return;
        }

        dispatch(runActions(actions.map((a: any) => () => dispatch(a()))));
    }, [id]);

    return (
        <Modal open={open} disableEnforceFocus>
                <ScrollContainer>
                    <ModalContainer>
                        {!isModalLoading && template}
                    </ModalContainer>
                </ScrollContainer>
            </Modal>
    )
}
