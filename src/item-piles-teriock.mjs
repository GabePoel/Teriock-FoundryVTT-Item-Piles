Hooks.once("item-piles-ready", async () => {
  const CONFIG = {
    ACTOR_CLASS_TYPE: "inventory",
    CURRENCIES: [{
      type: "attribute",
      name: "TERIOCK.TERMS.Currency.heartstoneRuby",
      img: "systems/teriock/src/icons/currency/heartstone-ruby.webp",
      abbreviation: "{#}HR",
      data: {
        path: "system.money.heartstoneRuby",
      },
      primary: false,
      exchangeRate: 5000,
      index: 0,
      id: "system.money.heartstoneRuby",
      secondary: false,
    }, {
      type: "attribute",
      name: "TERIOCK.TERMS.Currency.magusQuartz",
      img: "systems/teriock/src/icons/currency/magus-quartz.webp",
      abbreviation: "{#}MQ",
      data: {
        path: "system.money.magusQuartz",
      },
      primary: false,
      exchangeRate: 1000,
      index: 1,
      id: "system.money.magusQuartz",
      secondary: false,
    }, {
      type: "attribute",
      name: "TERIOCK.TERMS.Currency.moonOpal",
      img: "systems/teriock/src/icons/currency/moon-opal.webp",
      abbreviation: "{#}MO",
      data: {
        path: "system.money.moonOpal",
      },
      primary: false,
      exchangeRate: 500,
      index: 2,
      id: "system.money.moonOpal",
      secondary: false,
    }, {
      type: "attribute",
      name: "TERIOCK.TERMS.Currency.dragonEmerald",
      img: "systems/teriock/src/icons/currency/dragon-emerald.webp",
      abbreviation: "{#}DE",
      data: {
        path: "system.money.dragonEmerald",
      },
      primary: false,
      exchangeRate: 100,
      index: 3,
      id: "system.money.dragonEmerald",
      secondary: false,
    }, {
      type: "attribute",
      name: "TERIOCK.TERMS.Currency.snowDiamond",
      img: "systems/teriock/src/icons/currency/snow-diamond.webp",
      abbreviation: "{#}SD",
      data: {
        path: "system.money.snowDiamond",
      },
      primary: false,
      exchangeRate: 50,
      index: 4,
      id: "system.money.snowDiamond",
      secondary: false,
    }, {
      type: "attribute",
      name: "TERIOCK.TERMS.Currency.pixiePlumAmethyst",
      img: "systems/teriock/src/icons/currency/pixie-plum-amethyst.webp",
      abbreviation: "{#}PA",
      data: {
        path: "system.money.pixiePlumAmethyst",
      },
      primary: false,
      exchangeRate: 20,
      index: 5,
      id: "system.money.pixiePlumAmethyst",
      secondary: false,
    }, {
      type: "attribute",
      name: "TERIOCK.TERMS.Currency.fireEyeRuby",
      img: "systems/teriock/src/icons/currency/fire-eye-ruby.webp",
      abbreviation: "{#}FR",
      data: {
        path: "system.money.fireEyeRuby",
      },
      primary: false,
      exchangeRate: 10,
      index: 6,
      id: "system.money.fireEyeRuby",
      secondary: false,
    }, {
      type: "attribute",
      name: "TERIOCK.TERMS.Currency.entTearAmber",
      img: "systems/teriock/src/icons/currency/ent-tear-amber.webp",
      abbreviation: "{#}EA",
      data: {
        path: "system.money.entTearAmber",
      },
      primary: false,
      exchangeRate: 5,
      index: 7,
      id: "system.money.entTearAmber",
      secondary: false,
    }, {
      type: "attribute",
      name: "TERIOCK.TERMS.Currency.gold",
      img: "systems/teriock/src/icons/currency/gold.webp",
      abbreviation: "{#}GP",
      data: {
        path: "system.money.gold",
      },
      primary: true,
      exchangeRate: 1,
      index: 8,
      id: "system.money.gold",
      secondary: false,
    }, {
      type: "attribute",
      name: "TERIOCK.TERMS.Currency.silver",
      img: "systems/teriock/src/icons/currency/silver.webp",
      abbreviation: "{#}SP",
      data: {
        path: "system.money.silver",
      },
      primary: true,
      exchangeRate: 0.1,
      index: 9,
      id: "system.money.silver",
      secondary: false,
    }, {
      type: "attribute",
      name: "TERIOCK.TERMS.Currency.copper",
      img: "systems/teriock/src/icons/currency/copper.webp",
      abbreviation: "{#}CP",
      data: {
        path: "system.money.copper",
      },
      primary: true,
      exchangeRate: 0.01,
      index: 10,
      id: "system.money.copper",
      secondary: false,
    }],
    CURRENCY_DECIMAL_DIGITS: 0.00001,
    ITEM_CLASS_EQUIPMENT_TYPE: "equipment",
    ITEM_CLASS_LOOT_TYPE: "equipment",
    ITEM_CLASS_WEAPON_TYPE: "equipment",
    ITEM_FILTERS: [{
      path: "type", filters: "archetype,body,mount,power,rank,species,wrapper",
    }],
    ITEM_PRICE_ATTRIBUTE: "system.price",
    ITEM_QUANTITY_ATTRIBUTE: "system.quantity",
    ITEM_SIMILARITIES: ["name", "type", "system.identifier", "system.consumable", "system._sup"],
    QUANTITY_FOR_PRICE_ATTRIBUTE: "flags.item-piles.system.quantityForPrice",
    SECONDARY_CURRENCIES: [],
    UNSTACKABLE_ITEM_TYPES: ["archetype", "body", "mount", "power", "rank", "species"],
    ITEM_TYPE_HANDLERS: {
      GLOBAL: {
        [game.itempiles.CONSTANTS.ITEM_TYPE_METHODS.IS_CONTAINED]: ({item}) => {
          const itemData = item instanceof Item ? item.toObject() : item;
          return itemData?.system?._sup;
        },
        [game.itempiles.CONSTANTS.ITEM_TYPE_METHODS.IS_CONTAINED_PATH]: "system._sup",
      },
      equipment: {
        [game.itempiles.CONSTANTS.ITEM_TYPE_METHODS.CONTENTS]: ({item}) => {
          if (!item.parent) return [];
          return out.equipment;
        },
        [game.itempiles.CONSTANTS.ITEM_TYPE_METHODS.TRANSFER]: ({item, items, raw = false} = {}) => {
          if (!item.parent) return items;
          const subs = item.allSubs?.contents ?? [];
          items.push(...subs.map(s => raw ? s : s.toObject()));
          return items;
        }
      }
    }
  };
  await game.itempiles.API.addSystemIntegration(CONFIG, "0.12.0");
});

Hooks.on("preCreateItem", (item, _data, options) => {
  if (item.type === "equipment") {
    item.updateSource({
      "flags.item-piles.item.canStack": toFlag(foundry.utils.getProperty(item, "system.consumable")),
    });
    if (typeof item.actor?.getFlag === "function") {
      if (item.actor.getFlag("item-piles", "data")?.enabled) {
        options.dontFilterSubs = true;
      }
    }
  }
});

Hooks.on("preUpdateItem", (item, changed) => {
  if ((item.type === "equipment" || changed.type === "equipment") && foundry.utils.hasProperty(changed, "system.consumable")) {
    foundry.utils.setProperty(changed, "flags.item-piles.item.canStack", toFlag(foundry.utils.getProperty(changed, "system.consumable")));
  }
});

function toFlag(consumable) {
  return consumable ? "default" : false;
}
