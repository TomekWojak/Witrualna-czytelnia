import { asideLinksMain, asideLinks, settingsLinks } from "@/lib/content";

export const getActiveLink = (pathname: string) => {
	const links = [...asideLinksMain, ...asideLinks, ...settingsLinks];
	const activeLink = links.find((link) => pathname.startsWith(link.href));
	return activeLink;
};
