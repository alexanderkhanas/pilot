import { types as t } from 'mobx-state-tree';
import { AsyncStorage } from 'react-native';
import uuid from 'react-native-uuid';
import { btoa, atob } from 'Base64';
import md5 from 'md5';

const Card = t.model('PlaceModel', {
  number: t.maybeNull(t.string),
  cvc: t.maybeNull(t.string),
  date: t.maybeNull(t.string),
  name: t.maybeNull(t.string),
  id: t.maybeNull(t.string),
});

export const CardsStore = t
  .model('CardsStore', {
    all: t.array(Card, []),
  })
  .actions((self) => ({
    setAll(cards) {
      self.all = cards;
      AsyncStorage.setItem('_cards', encodeCards(cards));
    },
    add(card) {
      const allCards = [...self.all, { ...card, id: uuid() }];
      const encoded = encodeCards(allCards);
      console.log('coded', encoded);
      self.all = allCards;
      AsyncStorage.setItem('_cards', encoded);
    },
    delete(id) {
      const filteredCards = self.all.filter((card) => card.id !== id);
      self.all = filteredCards;
      AsyncStorage.setItem('_cards', encodeCards(filteredCards));
    },
  }));

const encodeCards = (cards) => {
  const cardData = [];
  const names = [];
  cards.forEach(({ number, date, cvc, id, name }) => {
    cardData.push({ number, date, cvc, id });
    names.push(name);
  });
  return btoa(JSON.stringify(cardData)) + ';__;' + names.join(';_;');
};
