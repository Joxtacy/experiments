const map = new WeakMap();

let o1 = { hi: "hello" };
let o2 = { hi: "yo" };

map.set(o1, "hello");
map.set(o2, "yo");

o1 = null;

console.log(map);

console.log(o2);
