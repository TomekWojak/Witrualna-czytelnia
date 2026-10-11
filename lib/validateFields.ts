export const validateReflections = (
	text: string,
): { success: false; message: string } | { success: true } => {
	if (typeof text !== "string")
		return { success: false, message: "Błędny typ danych" };

	const reflectionValue = text.trim();

	if (reflectionValue.length === 0)
		return { success: false, message: "Uzupełnij wymagane pola" };

	if (reflectionValue.length < 20)
		return { success: false, message: "Uzyj co najmniej 20 znaków" };

	return { success: true };
};
