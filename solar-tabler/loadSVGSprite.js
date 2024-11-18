const getIconPaths = () => {
	return {
		SOLAR: {
			primary: "https://cdn.jsdelivr.net/gh/mellowapricot/solar-iconset@main/solar-icon.svg",
			fallback: "https://mellowapricot.github.io/solar-iconset/solar-icon.svg"
		},
		TABLER: {
			primary: "https://cdn.jsdelivr.net/gh/mellowapricot/tabler-icons@3.3.0/tabler-icon.svg",
			fallback: "https://mellowapricot.github.io/tabler-icons/tabler-icon.svg"
		}
	};
};

async function fetchSvg(iconName) {
	const iconPaths = getIconPaths();
	const { primary, fallback } = iconPaths[iconName];

	async function attemptFetch(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`${url}을(를) 불러오는 데 실패했습니다.`);
			}
			return await response.text();
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	let svgText = await attemptFetch(primary);

	if (!svgText) {
		console.log(`${iconName}의 기본 URL 불러오기에 실패하여 대체 URL을 시도합니다...`);
		svgText = await attemptFetch(fallback);
	}

	return svgText || "";
}

function createSvgContainer() {
	const container = document.createElement("div");
	container.classList.add("svg-container");
	document.body.prepend(container);
	return container;
}

async function insertSvgsIntoContainer(container) {
	const iconNames = Object.keys(getIconPaths());
	const svgTexts = await Promise.all(iconNames.map(fetchSvg));
	svgTexts.forEach(svgText => container.insertAdjacentHTML("beforeend", svgText));
}

async function initSvg() {
	const container = createSvgContainer();
	await insertSvgsIntoContainer(container);
}

initSvg();
