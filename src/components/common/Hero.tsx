import type React from "react";
import { useTranslation } from "react-i18next";

export const Hero: React.FC = () => {
	const { t } = useTranslation();

	return (
		<section className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 py-16">
			<div className="container mx-auto max-w-6xl px-4">
				<div className="text-center">
					<h1 className="mb-4 text-5xl font-bold text-green-600">{t("hero.title")}</h1>
					<p className="mb-2 text-xl font-semibold text-gray-800">
						{t("hero.subtitle")}
					</p>
					<p className="text-lg text-gray-600">{t("hero.description")}</p>
				</div>
			</div>
		</section>
	);
};
