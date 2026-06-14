Hooks.once("item-piles-ready", async () => {
  const CONFIG = {
    ACTOR_CLASS_TYPE: "inventory",
    CURRENCIES: [{
      abbreviation: "{#}HR",
      data: { path: "system.money.heartstoneRuby" },
      exchangeRate: 5000,
      id: "system.money.heartstoneRuby",
      img: "systems/teriock/src/icons/currency/heartstone-ruby.webp",
      index: 0,
      name: "TERIOCK.TERMS.Currency.heartstoneRuby",
      primary: false,
      secondary: false,
      type: "attribute",
    }, {
      abbreviation: "{#}MQ",
      data: { path: "system.money.magusQuartz" },
      exchangeRate: 1000,
      id: "system.money.magusQuartz",
      img: "systems/teriock/src/icons/currency/magus-quartz.webp",
      index: 1,
      name: "TERIOCK.TERMS.Currency.magusQuartz",
      primary: false,
      secondary: false,
      type: "attribute",
    }, {
      abbreviation: "{#}MO",
      data: { path: "system.money.moonOpal" },
      exchangeRate: 500,
      id: "system.money.moonOpal",
      img: "systems/teriock/src/icons/currency/moon-opal.webp",
      index: 2,
      name: "TERIOCK.TERMS.Currency.moonOpal",
      primary: false,
      secondary: false,
      type: "attribute",
    }, {
      abbreviation: "{#}DE",
      data: { path: "system.money.dragonEmerald" },
      exchangeRate: 100,
      id: "system.money.dragonEmerald",
      img: "systems/teriock/src/icons/currency/dragon-emerald.webp",
      index: 3,
      name: "TERIOCK.TERMS.Currency.dragonEmerald",
      primary: false,
      secondary: false,
      type: "attribute",
    }, {
      abbreviation: "{#}SD",
      data: { path: "system.money.snowDiamond" },
      exchangeRate: 50,
      id: "system.money.snowDiamond",
      img: "systems/teriock/src/icons/currency/snow-diamond.webp",
      index: 4,
      name: "TERIOCK.TERMS.Currency.snowDiamond",
      primary: false,
      secondary: false,
      type: "attribute",
    }, {
      abbreviation: "{#}PA",
      data: { path: "system.money.pixiePlumAmethyst" },
      exchangeRate: 20,
      id: "system.money.pixiePlumAmethyst",
      img: "systems/teriock/src/icons/currency/pixie-plum-amethyst.webp",
      index: 5,
      name: "TERIOCK.TERMS.Currency.pixiePlumAmethyst",
      primary: false,
      secondary: false,
      type: "attribute",
    }, {
      abbreviation: "{#}FR",
      data: { path: "system.money.fireEyeRuby" },
      exchangeRate: 10,
      id: "system.money.fireEyeRuby",
      img: "systems/teriock/src/icons/currency/fire-eye-ruby.webp",
      index: 6,
      name: "TERIOCK.TERMS.Currency.fireEyeRuby",
      primary: false,
      secondary: false,
      type: "attribute",
    }, {
      abbreviation: "{#}EA",
      data: { path: "system.money.entTearAmber" },
      exchangeRate: 5,
      id: "system.money.entTearAmber",
      img: "systems/teriock/src/icons/currency/ent-tear-amber.webp",
      index: 7,
      name: "TERIOCK.TERMS.Currency.entTearAmber",
      primary: false,
      secondary: false,
      type: "attribute",
    }, {
      abbreviation: "{#}GP",
      data: { path: "system.money.gold" },
      exchangeRate: 1,
      id: "system.money.gold",
      img: "systems/teriock/src/icons/currency/gold.webp",
      index: 8,
      name: "TERIOCK.TERMS.Currency.gold",
      primary: true,
      secondary: false,
      type: "attribute",
    }, {
      abbreviation: "{#}SP",
      data: { path: "system.money.silver" },
      exchangeRate: 0.1,
      id: "system.money.silver",
      img: "systems/teriock/src/icons/currency/silver.webp",
      index: 9,
      name: "TERIOCK.TERMS.Currency.silver",
      primary: true,
      secondary: false,
      type: "attribute",
    }, {
      abbreviation: "{#}CP",
      data: { path: "system.money.copper" },
      exchangeRate: 0.01,
      id: "system.money.copper",
      img: "systems/teriock/src/icons/currency/copper.webp",
      index: 10,
      name: "TERIOCK.TERMS.Currency.copper",
      primary: true,
      secondary: false,
      type: "attribute",
    }],
    CURRENCY_DECIMAL_DIGITS: 0.00001,
    ITEM_CLASS_EQUIPMENT_TYPE: "equipment",
    ITEM_CLASS_LOOT_TYPE: "equipment",
    ITEM_CLASS_WEAPON_TYPE: "equipment",
    ITEM_FILTERS: [{ filters: "archetype,body,mount,power,rank,species,wrapper", path: "type" }],
    ITEM_PRICE_ATTRIBUTE: "system.price",
    ITEM_QUANTITY_ATTRIBUTE: "system.quantity",
    ITEM_SIMILARITIES: ["name", "type", "system.identifier", "system.consumable", "system._sup"],
    ITEM_TYPE_HANDLERS: {
      equipment: {
        [game.itempiles.CONSTANTS.ITEM_TYPE_METHODS.CONTENTS]: ({ item }) => {
          if (!item.parent) { return []; }
          return out.equipment;
        },
        [game.itempiles.CONSTANTS.ITEM_TYPE_METHODS.TRANSFER]: ({ item, items, raw = false } = {}) => {
          if (!item.parent) { return items; }
          const subs = item.allSubs?.contents ?? [];
          items.push(...subs.map(s => raw ? s : s.toObject()));
          return items;
        },
      },
      GLOBAL: {
        [game.itempiles.CONSTANTS.ITEM_TYPE_METHODS.IS_CONTAINED_PATH]: "system._sup",
        [game.itempiles.CONSTANTS.ITEM_TYPE_METHODS.IS_CONTAINED]: ({ item }) => {
          const itemData = item instanceof Item ? item.toObject() : item;
          return itemData?.system?._sup;
        },
      },
    },
    QUANTITY_FOR_PRICE_ATTRIBUTE: "flags.item-piles.system.quantityForPrice",
    SECONDARY_CURRENCIES: [],
    UNSTACKABLE_ITEM_TYPES: ["archetype", "body", "mount", "power", "rank", "species"],
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
  if (
    (item.type === "equipment" || changed.type === "equipment")
    && foundry.utils.hasProperty(changed, "system.consumable")
  ) {
    foundry.utils.setProperty(
      changed,
      "flags.item-piles.item.canStack",
      toFlag(foundry.utils.getProperty(changed, "system.consumable")),
    );
  }
});

/**
 * @param consumable
 */
function toFlag(consumable) {
  return consumable ? "default" : false;
}
