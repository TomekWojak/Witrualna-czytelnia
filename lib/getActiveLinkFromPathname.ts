import { asideLinksMain, asideLinks } from "@/lib/content";

export const getActiveLink = (pathname: string) => {
	const links = [...asideLinksMain, ...asideLinks];
	const activeLink = links.find((link) => pathname.startsWith(link.href));
	return activeLink;
};
