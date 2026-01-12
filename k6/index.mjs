const derp = (s) =>
	new Promise((res, rej) => {
		setTimeout(() => {
			console.log("derp", s);
			res(s);
		}, 1000);
	});

derp(69);
console.log("done");
