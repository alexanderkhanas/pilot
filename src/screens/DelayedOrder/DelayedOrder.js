import React from 'react';
import s from './DelayedOrder.s';
import GestureWrapper from '../../components/GestureWrapper/GestureWrapper';
import { observer } from 'mobx-react';
import { useStore } from '../../stores/createStore';

const DelayedOrder = () => {
  const { delayedOrder } = useStore((store) => store.viewer);
  return <GestureWrapper></GestureWrapper>;
};

export default observer(DelayedOrder);
