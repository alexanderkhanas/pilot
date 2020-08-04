import { types as t } from 'mobx-state-tree';
import {
  ViewerLocationModel,
  ViewerProfileModel,
  ViewerOrderModel,
  ViewerHistoryModel,
  ViewerThemeModel,
  ViewerDelayedOrderModel,
  ViewerDriverModel,
} from './models';

export const ViewerStore = t
  .model('ViewerModel', {
    location: t.optional(ViewerLocationModel, {}),
    profile: t.optional(ViewerProfileModel, {}),
    isLoggedIn: t.maybeNull(t.boolean),
    order: t.optional(ViewerOrderModel, {}),
    history: t.optional(ViewerHistoryModel, {}),
    theme: t.optional(ViewerThemeModel, {}),
    delayedOrder: t.optional(ViewerDelayedOrderModel, {}),
    driver: t.optional(ViewerDriverModel, {}),
  })
  .actions((self) => ({
    setLoggedIn(status) {
      if (arguments.length !== 0) self.isLoggedIn = status;
      else self.isLoggedIn = !self.isLoggedIn;
    },
  }));
