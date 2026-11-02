Hooks.once("item-piles-ready", async () => {
  let n = 0;
  const nonEquipmentTypes = Item.implementation.TYPES.filter(t => t !== "equipment");
  const CONFIG = {
    ACTOR_CLASS_TYPE: "inventory",
    CURRENCIES: Object.entries(TERIOCK.CONFIG.currency).sort((a, b) => b[1].conversion - a[1].conversion).map(
      ([k, v]) => {
        return {
          abbreviation: `{#} ${v.symbol}`,
          data: { path: `system.money.${k}` },
          exchangeRate: v.conversion,
          id: `system.money.${k}`,
          img: v.img,
          index: n++,
          name: v.label,
          primary: v.conversion <= 1,
          secondary: false,
          type: "attribute",
        };
      },
    ),
    CURRENCY_DECIMAL_DIGITS: 0.01,
    ITEM_CLASS_EQUIPMENT_TYPE: "equipment",
    ITEM_CLASS_LOOT_TYPE: "equipment",
    ITEM_CLASS_WEAPON_TYPE: "equipment",
    ITEM_COST_TRANSFORMER: getGoldPrice,
    ITEM_FILTERS: [{ filters: nonEquipmentTypes.join(","), path: "type" }],
    ITEM_PRICE_ATTRIBUTE: "system.price",
    ITEM_QUANTITY_ATTRIBUTE: "system.quantity.value",
    ITEM_SIMILARITIES: ["name", "type", "system.identifier", "system.consumption.enabled", "system._sup"],
    ITEM_TYPE_HANDLERS: {
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
    UNSTACKABLE_ITEM_TYPES: nonEquipmentTypes,
  };
  await game.itempiles.API.addSystemIntegration(CONFIG, "0.12.0");
});

Hooks.on("preCreateItem", item => {
  if (item.type === "equipment") {
    item.updateSource({ "flags.item-piles.item.canStack": getStackFlag(item._source.system) });
  }
});

Hooks.on("preUpdateItem", (item, changed) => {
  if (
    (item.type === "equipment" || changed.type === "equipment")
    && ["system.consumption.enabled", "system.storage.enabled"].some(p => foundry.utils.hasProperty(changed, p))
  ) {
    const system = foundry.utils.mergeObject(item._source.system, changed.system ?? {}, { inplace: false });
    foundry.utils.setProperty(changed, "flags.item-piles.item.canStack", getStackFlag(system));
  }
});

/**
 * Get price of an item in gold.
 * @param {object} item
 * @returns {number}
 */
function getGoldPrice(item) {
  if (item instanceof Item) { return item.system.price?.value ?? 0; }
  const price = foundry.utils.getProperty(item, "system.price");
  // Handling for old price format
  if (typeof price === "number") { return price; }
  return new teriock.data.models.CurrencyUnitModel(price ?? {}).value;
}

/**
 * Equipment can only stack if consumption is enabled and storage isn't.
 * @param {object} system
 * @returns {"default"|false}
 */
function getStackFlag(system) {
  return system?.consumption?.enabled && !system?.storage?.enabled ? "default" : false;
}
