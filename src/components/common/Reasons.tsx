import type React from "react";
import { useTranslation } from "react-i18next";

export const ReasonCard: React.FC<{
	icon: string;
	title: string;
	description: string;
}> = ({ icon, title, description }) => {
	return (
		<div className="rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
			<div className="mb-4 text-4xl">{icon}</div>
			<h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
			<p className="text-gray-600">{description}</p>
		</div>
	);
};

export const Reasons: React.FC = () => {
	const { t } = useTranslation();

	const reasons = [
		{
			icon: "📊",
			title: t("reasons.realtime.title"),
			description: t("reasons.realtime.description"),
		},
		{
			icon: "💸",
			title: t("reasons.transparent.title"),
			description: t("reasons.transparent.description"),
		},
		{
			icon: "🏦",
			title: t("reasons.rational.title"),
			description: t("reasons.rational.description"),
		},
		{
			icon: "📱",
			title: t("reasons.tracking.title"),
			description: t("reasons.tracking.description"),
		},
	];

	return (
		<section className="py-16">
			<div className="container mx-auto max-w-6xl px-4">
				<h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
					{t("reasons.title")}
				</h2>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{reasons.map((reason) => (
						<ReasonCard
							key={reason.title + reason.description}
							icon={reason.icon}
							title={reason.title}
							description={reason.description}
						/>
					))}
				</div>
			</div>
		</section>
	);
};
