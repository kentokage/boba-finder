export function cloneMap(map) {
	const newMap = new Map();
	map.forEach((value, key) => {
		newMap.set(key, { ...value });
	});
	return newMap;
}
