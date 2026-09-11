Hooks.once("item-piles-ready", async () => {
  let n = 0;
  const CONFIG = {
    ACTOR_CLASS_TYPE: "inventory",
    CURRENCIES: Object.entries(TERIOCK.config.currency).sort((a, b) => b[1].conversion - a[1].conversion).map(
      ([k, v]) => {
        const kebab = teriock.helpers.string.toKebabCase(k);
        const words = kebab.split("-");
        if (words.length === 1) { words.push("p"); }
        const a = words[0][0].titleCase();
        const b = words.at(-1)[0].titleCase();
        const abbreviation = `{#}${a}${b}`;
        return {
          abbreviation,
          data: { path: `system.money.${k}` },
          exchangeRate: v.conversion,
          id: `system.money.${k}`,
          img: `systems/teriock/src/icons/currency/${kebab}.webp`,
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
    ITEM_FILTERS: [{ filters: "archetype,body,mount,power,rank,species,wrapper", path: "type" }],
    ITEM_PRICE_ATTRIBUTE: "system.price",
    ITEM_QUANTITY_ATTRIBUTE: "system.quantity.value",
    ITEM_SIMILARITIES: ["name", "type", "system.identifier", "system.consumable", "system._sup"],
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
    UNSTACKABLE_ITEM_TYPES: ["archetype", "body", "mount", "power", "rank", "species"],
  };
  await game.itempiles.API.addSystemIntegration(CONFIG, "0.12.0");
});

Hooks.on("preCreateItem", (item, _data, options) => {
  if (item.type === "equipment") {
    item.updateSource({
      "flags.item-piles.item.canStack": toFlag(foundry.utils.getProperty(item, "system.consumable")),
    });
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
