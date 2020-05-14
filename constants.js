//control Taste Profile User Interactions
// const data_path = "data/";
// const img_path = "http://localhost/wineproject/img/";
const data_path = "https://yinan-chen.github.io/wineproject/data/";
const img_path = "https://yinan-chen.github.io/wineproject/img/";
const flavors = {
    "White": ["Citrus Fruit","Stone Fruit","Tropical Fruit","Floral","Herbal","Creaminess"],
    "Red":["Red Fruit","Black Fruit","Floral","Herbal","Cooking Spice","Leather"]
};
const definitions_white = {
    "CitrusFruit":"Some common citrus fruit flavors in white wines include tangerine, lemon, lime, etc.",
    "StoneFruit":"Stone fruits referred to fruits with a hard stone-seed. Some common flavors in white wine include apricots, peaches, nectarine and plums, etc.",
    "TropicalFruit":"Tropical fruits flavors in white wine include pineapple, mango, kiwi, leechie, passion fruit, etc.",
    "FloralWhite":"Floral tastes in red wine come from a variety of chemical compounds. Some frequent flowers include citrus blossom and lilies.",
    "Herbal":"Herbal also sometimes refers to green taste. Common herbal flavors found in white wine include Thai basil, Sage, Shallot, dtc.",
    "Creaminess":"Creamy wine often has an oiliness and smooth texture. It is popularly used to describe white wines fermented or aged in oak."
};

const definitions_red = {
	"RedFruit":"Red fruit flavors in red wines include cranberry, raspberry, pomegranate, cherry, etc.",
	"BlackFruit":"Wines with more “black fruit” flavors tend to be more full-bodied. Some common black fruit tastes in red wines include blackberry, blueberry, plum, fig, Acai, etc.",
	"FloralRed":"Floral tastes in red wine come from a variety of chemical compounds. Some frequent flowers include Geranium, rose, violet and lavender.",
	"Herbal":"Herbal also sometimes refers to green taste. Common herbal flavors found in red wine include basil, mint, thyme, dill, dtc.",
	"CookingSpice":"Species exist more as aroma than taste in wine. Common spicy flavours found in red wine include black pepper, cinnamon, clove, ginger, etc.",
	"Leather":"The leather aroma and flavor will be clean – new saddle, bookbinding, leather bag. Texturally, the wine will feel like a chewy steak. It’ll feel thick, dense, big and soft in the mouth."
};

const definitions = {
	"White":definitions_white,
	"Red":definitions_red
};