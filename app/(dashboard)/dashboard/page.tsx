"use client";
import DashboardAside from "@/components/DashboardAside";
import DashboardContent from "@/components/DashboardContent";
import { useState } from "react";

export default function Home() {
	const [isAsideOpen, setIsAsideOpen] = useState(false);

	return (
		<div className="dashboard-content flex w-full h-full">
			<DashboardAside asideOpen={isAsideOpen} />
			<DashboardContent
				asideOpen={isAsideOpen}
				onAsideOpenAction={setIsAsideOpen}
			/>
		</div>
	);
}
