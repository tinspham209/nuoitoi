import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DonationForm } from "@/components/common/DonationForm";
import { Header } from "@/components/common/Header";
import { Hero } from "@/components/common/Hero";
import { Reasons } from "@/components/common/Reasons";
import { Stats } from "@/components/common/Stats";
import { vietqrService } from "@/services/vietqr";
import type { Bank } from "@/types/index";

export const Home: React.FC = () => {
	const { t } = useTranslation();
	const [banks, setBanks] = useState<Bank[]>([]);
	const [isLoadingBanks, setIsLoadingBanks] = useState(true);

	useEffect(() => {
		const loadBanks = async () => {
			try {
				const bankList = await vietqrService.getBanks();
				console.log("bankList: ", bankList);
				setBanks(bankList);
			} catch (error) {
				console.error("Failed to load banks:", error);
			} finally {
				setIsLoadingBanks(false);
			}
		};

		loadBanks();
	}, []);

	return (
		<div className="min-h-screen bg-white">
			<Header />
			<Hero />
			<Reasons />

			{/* Commitments Section */}
			<section className="border-t border-gray-200 py-16">
				<div className="container mx-auto max-w-6xl px-4">
					<h2 className="mb-8 text-4xl font-bold text-gray-800">
						{t("commitments.title")}
					</h2>
					<div className="space-y-3">
						<p className="text-gray-700">{t("commitments.daily")}</p>
						<p className="text-gray-700">{t("commitments.honest")}</p>
						<p className="text-gray-700">{t("commitments.receipt")}</p>
						<p className="text-gray-700">{t("commitments.unboxing")}</p>
						<p className="text-gray-700">{t("commitments.hotline")}</p>
						<p className="text-gray-700">{t("commitments.noblock")}</p>
					</div>
				</div>
			</section>

			{/* Comparison Section */}
			<section className="border-t border-gray-200 bg-gray-50 py-16">
				<div className="container mx-auto max-w-6xl px-4">
					<h2 className="mb-12 text-4xl font-bold text-gray-800">
						{t("comparison.title")}
					</h2>
					<div className="grid gap-8 md:grid-cols-2">
						{/* Others */}
						<div className="rounded-lg border-2 border-red-200 bg-white p-6">
							<h3 className="mb-4 text-2xl font-bold text-red-600">
								{t("comparison.others")}
							</h3>
							<ul className="space-y-2 text-gray-700">
								<li>{t("comparison.othersStatement")}</li>
								<li>{t("comparison.othersExcel")}</li>
								<li>{t("comparison.othersMath")}</li>
								<li>{t("comparison.othersBlock")}</li>
							</ul>
						</div>

						{/* Me */}
						<div className="rounded-lg border-2 border-green-200 bg-white p-6">
							<h3 className="mb-4 text-2xl font-bold text-green-600">
								{t("comparison.me")}
							</h3>
							<ul className="space-y-2 text-gray-700">
								<li>{t("comparison.myStatement")}</li>
								<li>{t("comparison.myExcel")}</li>
								<li>{t("comparison.myMath")}</li>
								<li>{t("comparison.myReply")}</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* Donation Section */}
			<section className="border-t border-gray-200 py-16">
				<div className="container mx-auto max-w-6xl px-4">
					<h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
						{t("donation.title")}
					</h2>
					{isLoadingBanks ? (
						<div className="flex justify-center">
							<div className="text-gray-600">{t("donation.generating")}</div>
						</div>
					) : (
						<DonationForm
							banks={banks.map((bank) => ({
								id: bank.code,
								name: bank.name,
								code: bank.code,
							}))}
						/>
					)}
				</div>
			</section>

			{/* Spending Section */}
			<section className="border-t border-gray-200 bg-gray-50 py-16">
				<div className="container mx-auto max-w-6xl px-4">
					<h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
						{t("spending.title")}
					</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{[
							{ key: "food", icon: "🍚" },
							{ key: "utilities", icon: "💡" },
							{ key: "rent", icon: "🏠" },
							{ key: "health", icon: "💊" },
							{ key: "education", icon: "📚" },
							{ key: "entertainment", icon: "🎬" },
						].map(({ key, icon }) => (
							<div
								key={key}
								className="rounded-lg border border-gray-200 bg-white p-6"
							>
								<div className="mb-2 text-3xl">{icon}</div>
								<p className="text-gray-700">{t(`spending.${key}`)}</p>
							</div>
						))}
					</div>
					<div className="mt-8 text-center text-gray-600">
						{t("spending.detailedChart")}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<Stats />

			{/* Message Section */}
			<section className="border-t border-gray-200 py-16">
				<div className="container mx-auto max-w-6xl px-4">
					<h2 className="mb-8 text-center text-4xl font-bold text-gray-800">
						{t("message.title")}
					</h2>
					<div className="rounded-lg border border-blue-200 bg-blue-50 p-8">
						<p className="mb-4 whitespace-pre-line text-gray-700">
							{t("message.content")}
						</p>
						<p className="text-gray-700">{t("message.ps")}</p>
					</div>
				</div>
			</section>

			{/* Disclaimer */}
			<section className="border-t border-gray-200 bg-gray-50 py-16">
				<div className="container mx-auto max-w-6xl px-4">
					<h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
						{t("disclaimer.title")}
					</h2>
					<p className="text-center text-gray-600">{t("disclaimer.content")}</p>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-gray-200 bg-gray-900 py-8 text-white">
				<div className="container mx-auto max-w-6xl px-4">
					<div className="text-center flex flex-row flex-wrap justify-center gap-4">
						<a href="https://tinspham.dev" target="_blank" rel="noopener">
							@tinspham.dev
						</a>
						|
						<a
							href="https://tinspham.dev/cv.pdf"
							target="_blank"
							rel="noopener"
						>
							View my CV
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
};
