import React, { useRef, useContext } from 'react';
import s from './Card.s';
import { observer } from 'mobx-react';
import { useStore } from '../../stores/createStore';
import { Image, Text, TouchableWithoutFeedback, Animated, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { AlertContext } from '../../context/AlertState';

const Card = ({ card, onCardSelect = () => {} }) => {
  const { name, number, id } = card;
  const { cards, viewer } = useStore((store) => store);
  const { theme } = viewer;
  const { openAlert } = useContext(AlertContext);
  const askToDelete = () => {
    openAlert({
      title: 'Видалити картку?',
      description: 'Ви дійсно хочете видалити картку',
      buttons: [
        { text: 'Так', onPress: () => cards.delete(id) },
        { text: 'Ні', style: 'cancel' },
      ],
    });
  };
  return (
    <TouchableWithoutFeedback
      onLongPress={askToDelete}
      underlayColor={theme.main}
      onPress={() => onCardSelect(card)}
    >
      <View style={{ ...s.card, backgroundColor: theme.anotherMain }}>
        <Image
          style={s.cardLogo}
          source={
            card.type === 'visa'
              ? require('../../../assets/visa.png')
              : require('../../../assets/mastercard.png')
          }
        />
        <Text
          style={{
            ...s.cardName,
            color: theme.text,
          }}
        >
          {name}
        </Text>
        <Text style={{ ...s.cardNum, color: theme.text + '99' }}>
          {number.slice(0, 4) + '****' + number.slice(12)}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default observer(Card);
