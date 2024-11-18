const getIconPaths = () => {
	return {
		SOLAR: "https://cdn.jsdelivr.net/gh/mellowapricot/solar-iconset@main/solar-icon.svg",
		TABLER: "https://cdn.jsdelivr.net/gh/mellowapricot/tabler-icons@3.3.0/tabler-icon.svg"
	};
}

async function fetchSvg(iconName, retryCount = 0) {
	try {
		const iconPaths = getIconPaths();
		const response = await fetch(iconPaths[iconName]);
		if (!response.ok) {
			throw new Error(`Failed to load ${iconPaths[iconName]}`);
		}
		return await response.text();
	} catch (error) {
		console.error(error);
		if (retryCount < 1) {
			return fetchSvg(iconName, retryCount + 1);
		}
		return "";
	}
}

function createSvgContainer() {
	const container = document.createElement("div");
	container.classList.add("svg-container");
	document.body.prepend(container);
	return container;
}

async function insertSvgsIntoContainer(container) {
	const iconPaths = getIconPaths();
	const iconNames = Object.keys(iconPaths)
	const svgTexts = await Promise.all(iconNames.map(fetchSvg));
	svgTexts.forEach(svgText => container.insertAdjacentHTML("beforeend", svgText));
}

async function initSvg() {
	const container = createSvgContainer();
	await insertSvgsIntoContainer(container);
}

initSvg();