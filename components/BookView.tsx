"use client";
import { HeaderTitleContext } from "@/lib/headerTitleContext";
import { useContext, useEffect } from "react";

export default function BookView() {
	const titleContext = useContext(HeaderTitleContext);

	useEffect(() => {
		titleContext.setTitle("Testowy tytuł");

		return () => titleContext.setTitle(undefined);
	}, [titleContext]);

	return (
		<div className="p-4 w-full h-[50vh] bg-paper text-mainTxt border border-accent/30 rounded-2xl space-y-5">
			<h1>{titleContext.title}</h1>
			<p>
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
				voluptate eligendi dolore doloremque dolorum itaque voluptatum excepturi
				sint qui ducimus!
			</p>
			<p>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis,
				similique dolor? Excepturi cupiditate accusamus commodi labore suscipit
				iure quaerat magni atque, perferendis nam molestiae iusto debitis modi
				facilis inventore nulla dolore sunt nemo molestias aliquam laudantium,
				odit illo. Id, iure placeat soluta quas molestias aut enim assumenda
				amet omnis, voluptas ad tempore ex sapiente. Repellendus neque mollitia
				quisquam animi! Iure a, ipsa iste odio exercitationem nisi laborum rem
				officia delectus expedita dolore nobis quidem nesciunt libero inventore
				possimus esse iusto deleniti impedit, ullam sint? Quos saepe quas
				exercitationem consequatur! Minus totam odio velit, officiis amet
				repudiandae repellat quibusdam ipsa neque?
			</p>
		</div>
	);
}
