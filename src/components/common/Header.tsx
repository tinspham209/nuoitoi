import type React from "react";
import { useTranslation } from "react-i18next";

export const Header: React.FC = () => {
	const { t, i18n } = useTranslation();

	const handleLanguageChange = (lang: string) => {
		i18n.changeLanguage(lang);
		localStorage.setItem("language", lang);
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
			<div className="container mx-auto max-w-6xl px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="text-2xl font-bold text-green-600">{t("common.title")}</div>

					<div className="flex items-center gap-4">
						<div className="flex gap-2 rounded-lg border border-gray-300 bg-gray-100 p-1">
							<button
								onClick={() => handleLanguageChange("vi")}
								className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
									i18n.language === "vi"
										? "bg-white text-green-600 shadow-sm"
										: "text-gray-600 hover:text-gray-800"
								}`}
							>
								Tiếng Việt
							</button>
							<button
								onClick={() => handleLanguageChange("en")}
								className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
									i18n.language === "en"
										? "bg-white text-green-600 shadow-sm"
										: "text-gray-600 hover:text-gray-800"
								}`}
							>
								English
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
