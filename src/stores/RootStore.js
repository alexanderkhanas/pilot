import { types as t } from 'mobx-state-tree';
import { ViewerStore } from './ViewerStore';
import { AuthStore } from './AuthStore';
import { PlacesStore } from './PlacesStore';
import { CardsStore } from './CardsStore';

export const RootStore = t.model('RootStore', {
  viewer: t.optional(ViewerStore, {}),
  auth: t.optional(AuthStore, {}),
  places: t.optional(PlacesStore, {}),
  cards: t.optional(CardsStore, {}),
});
