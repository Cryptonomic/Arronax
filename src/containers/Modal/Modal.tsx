import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Modal from '@material-ui/core/Modal';

import { runActions } from '../../reducers/modal/thunk';
import { setModalLoading, cleanModal } from '../../reducers/modal/actions';
import { ScrollContainer, ModalContainer, CloseIcon } from './style';
import { getTemplate } from './controller';
import Loader from '../../components/Loader';

export const DynamicModal = (props: any) => {
    const { onClickPrimaryKey, onCloseEntityModal } = props;
    const list = useSelector(({ modal }: any) => modal.list, shallowEqual);
    const id = useSelector(({ modal }: any) => modal.id, shallowEqual);
    const isModalLoading = useSelector(({ modal }: any) => modal.isModalLoading, shallowEqual);
    const open = useSelector(({ modal }: any) => modal.open, shallowEqual);
    const attributes = useSelector(({ app }: any) => app.attributes, shallowEqual);
    const dispatch = useDispatch();
    const [count, setCount] = useState(0);
    const item = list.find((item: any) => item.id === id);
    const { platform, network, entity, items } = item;
    const [getComponent, getActions] = item && getTemplate(platform, network, entity, items[count], id, attributes)({ count, setCount, onClickPrimaryKey, items });

    const onClose = () => {
        dispatch(cleanModal());
        onCloseEntityModal();
    }

    useEffect(() => {
        const actions = getActions();
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
                    <CloseIcon onClick={onClose} size="19px" top="30px" right="30px" color="#9b9b9b" iconName="icon-close" />
                    {isModalLoading && <Loader />}
                    {!isModalLoading && getComponent()}
                </ModalContainer>
            </ScrollContainer>
        </Modal>
    );
};
