
export async function collectCall<T>(promise: Promise<T>): Promise<[T | null, unknown | null]> {
	try {
		return [await promise, null];
	} catch (error) {
		return [null, error];
	}
}
let a = new Promise<number>((resolve) => resolve(42));
let b: Promise<number> = new Promise((_resolve, reject) => reject("error hurr durr"));
console.log(await collectCall(a));
console.log(await collectCall<number>(b));


const curry = (a: number) => (b: number) => {
	return a + b
};

const add1 = curry(1);

console.log(curry(1)(2));

console.log(typeof add1);
console.log(add1(3));
console.log(add1(4));
