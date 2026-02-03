import type React from "react";
import { useTranslation } from "react-i18next";
import { useDonationStore } from "@/store/donation";

export const Stats: React.FC = () => {
	const { t } = useTranslation();
	const stats = useDonationStore((state) => state.stats);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("vi-VN").format(value);
	};

	return (
		<section className="border-t border-gray-200 bg-gray-50 py-16">
			<div className="container mx-auto max-w-6xl px-4">
				<h2 className="mb-12 text-center text-4xl font-bold text-gray-800">
					{t("stats.title")}
				</h2>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{/* Total Received */}
					<div className="rounded-lg border-2 border-green-200 bg-white p-6">
						<div className="text-sm font-semibold text-gray-600">
							{t("stats.totalReceived")}
						</div>
						<div className="mt-2 flex items-baseline gap-1">
							<span className="text-3xl font-bold text-green-600">
								{formatCurrency(stats.totalReceived)}
							</span>
							<span className="text-gray-600">{t("stats.dongSymbol")}</span>
						</div>
					</div>

					{/* Total Donations */}
					<div className="rounded-lg border-2 border-blue-200 bg-white p-6">
						<div className="text-sm font-semibold text-gray-600">
							{t("stats.totalDonations")}
						</div>
						<div className="mt-2 text-3xl font-bold text-blue-600">
							{stats.totalDonations}
						</div>
					</div>

					{/* Monthly Goal */}
					<div className="rounded-lg border-2 border-purple-200 bg-white p-6">
						<div className="text-sm font-semibold text-gray-600">
							{t("stats.monthlyGoal")}
						</div>
						<div className="mt-2 flex items-baseline gap-1">
							<span className="text-3xl font-bold text-purple-600">
								{formatCurrency(stats.monthlyGoal)}
							</span>
							<span className="text-gray-600">{t("stats.dongSymbol")}</span>
						</div>
					</div>

					{/* Expenses */}
					<div className="rounded-lg border-2 border-red-200 bg-white p-6">
						<div className="text-sm font-semibold text-gray-600">
							{t("stats.expenses")}
						</div>
						<div className="mt-2 flex items-baseline gap-1">
							<span className="text-3xl font-bold text-red-600">
								{formatCurrency(stats.expenses)}
							</span>
							<span className="text-gray-600">{t("stats.dongSymbol")}</span>
						</div>
					</div>
				</div>

				{/* Remaining */}
				<div className="mt-8 rounded-lg bg-white p-6">
					<div className="mb-4 text-center text-sm font-semibold text-gray-600">
						{t("common.remaining")}
					</div>
					<div className="text-center">
						<span
							className={`text-4xl font-bold ${
								stats.remaining >= 0 ? "text-green-600" : "text-red-600"
							}`}
						>
							{formatCurrency(Math.abs(stats.remaining))}
						</span>
						<span className="ml-1 text-gray-600">{t("stats.dongSymbol")}</span>
						{stats.remaining < 0 && (
							<div className="mt-2 text-sm text-red-600">
								({t("common.remaining")} is negative)
							</div>
						)}
					</div>
				</div>

				{/* View Full Statement */}
				<div className="mt-8 text-center">
					<a
						href="#"
						className="inline-block rounded-lg border-2 border-green-600 px-6 py-3 font-semibold text-green-600 transition-colors hover:bg-green-50"
					>
						{t("stats.viewFullStatement")}
					</a>
				</div>
			</div>
		</section>
	);
};
