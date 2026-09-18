type ThemeData = {
	name: string;
	"--accent": string;
	"--accent-secondary": string;
	"--main-color": string;
	"--panel-color": string;
	"--text-color": string;
};

export const themes: ThemeData[] = [
	{
		name: "Klasyczny",
		"--accent": "#193f64",
		"--accent-secondary": "#064c93",
		"--main-color": "#e8dddd",
		"--panel-color": "#f0eaea",
		"--text-color": "#193f64",
	},
	{
		name: "Sepia",
		"--accent": "#8a5a34",
		"--accent-secondary": "#b5793f",
		"--main-color": "#f2e6d0",
		"--panel-color": "#f8f0e0",
		"--text-color": "#3d2b18",
	},
	{
		name: "Szałwia",
		"--accent": "#3f6b4a",
		"--accent-secondary": "#6a9169",
		"--main-color": "#e7efe3",
		"--panel-color": "#f1f6ee",
		"--text-color": "#22301f",
	},
	{
		name: "Bursztyn",
		"--accent": "#e2a458",
		"--accent-secondary": "#c97b3a",
		"--main-color": "#1c2430",
		"--panel-color": "#121821",
		"--text-color": "#ece4d4",
	},
	{
		name: "Lawenda",
		"--accent": "#5f4382",
		"--accent-secondary": "#8467a8",
		"--main-color": "#efe8f7",
		"--panel-color": "#f7f2fb",
		"--text-color": "#2c2140",
	},
	{
		name: "Morska Bryza",
		"--accent": "#256570",
		"--accent-secondary": "#3f8f96",
		"--main-color": "#e6f1f2",
		"--panel-color": "#f2f9fa",
		"--text-color": "#16333a",
	},
];

// export const changeTheme = (data: themeData) => {
// 	for (const variable in data) {
// 		document.documentElement.style.setProperty(variable, data[variable]);
// 	}
// };
// stare, dopytać

export const changeTheme = (data: ThemeData) => {
	localStorage.setItem("themeData", JSON.stringify(data));

	for (const [variable, value] of Object.entries(data) as [
		keyof ThemeData,
		string,
	][]) {
		if (variable === "name") continue;
		document.documentElement.style.setProperty(variable, value);
	}
};
const isThemeData = (value: unknown): value is ThemeData => {
	if (typeof value !== "object" || value === null) return false;

	const data = value as Record<string, unknown>;

	return (
		typeof data.name === "string" &&
		typeof data["--accent"] === "string" &&
		typeof data["--accent-secondary"] === "string" &&
		typeof data["--main-color"] === "string" &&
		typeof data["--panel-color"] === "string" &&
		typeof data["--text-color"] === "string"
	);
};

export const getThemeIndex = (): number | undefined => {
	const themeData = localStorage.getItem("themeData");

	if (!themeData) return;

	try {
		const parsed: unknown = JSON.parse(themeData);

		if (!isThemeData(parsed)) return;

		const index = themes.findIndex((theme) => theme.name === parsed.name);

		return index;
	} catch {
		return;
	}
};
