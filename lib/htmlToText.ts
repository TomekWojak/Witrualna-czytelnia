const NAMED_ENTITIES: Record<string, string> = {
	nbsp: " ",
	amp: "&",
	quot: '"',
	apos: "'",
	lt: "<",
	gt: ">",
	hellip: "…",
	mdash: "—",
	ndash: "–",
	lsquo: "‘",
	rsquo: "’",
	ldquo: "“",
	rdquo: "”",
	bdquo: "„",
	laquo: "«",
	raquo: "»",
	shy: "",
};

const decodeEntities = (text: string) =>
	text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (entity, code: string) => {
		if (code[0] === "#") {
			const codePoint =
				code[1].toLowerCase() === "x"
					? parseInt(code.slice(2), 16)
					: parseInt(code.slice(1), 10);

			return Number.isNaN(codePoint) ? entity : String.fromCodePoint(codePoint);
		}

		return NAMED_ENTITIES[code.toLowerCase()] ?? entity;
	});

export const htmlToText = (html: string) => {
	const withLineBreaks = html
		.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<\/(p|div|h[1-6]|li|blockquote|section)>/gi, "\n\n");

	const withoutTags = withLineBreaks.replace(/<[^>]*>/g, "");

	return decodeEntities(withoutTags)
		.replace(/[ \t ]+/g, " ")
		.split("\n")
		.map((line) => line.trim())
		.join("\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
};
