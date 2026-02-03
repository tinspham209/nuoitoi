import { yupResolver } from "@hookform/resolvers/yup";
import type React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { vietqrService } from "@/services/vietqr";
import { useDonationStore } from "@/store/donation";
import { type DonationFormData, donationFormSchema } from "@/utils/validation";

export const DonationForm: React.FC<{
	banks: { id: string; name: string; code: string }[];
}> = ({ banks }) => {
	const { t } = useTranslation();

	const qrCode = useDonationStore((state) => state.qrCode);
	const isGeneratingQR = useDonationStore((state) => state.isGeneratingQR);

	const setQRCode = useDonationStore((state) => state.setQRCode);
	const setIsGeneratingQR = useDonationStore(
		(state) => state.setIsGeneratingQR,
	);
	const setQRError = useDonationStore((state) => state.setQRError);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<DonationFormData>({
		resolver: yupResolver(donationFormSchema),
		defaultValues: {
			bankCode: "TCB",
			accountNumber: "1234200999",
			yourName: "Mạnh thường quân",
			amount: 50000,
		},
	});

	const watchAmount = watch("amount");

	const onSubmit = async (data: DonationFormData) => {
		setIsGeneratingQR(true);
		setQRError(null);

		try {
			const description = `${data.yourName} donate for nuoi em Tin`;
			const result = await vietqrService.generateQR({
				bankCode: data.bankCode,
				accountNumber: data.accountNumber,
				amount: data.amount,
				description: description,
			});

			if (result.error) {
				setQRError(result.error);
				setQRCode("");
			} else if (result.qrCode) {
				setQRCode(result.qrCode);
			}
		} catch (error) {
			setQRError(error instanceof Error ? error.message : "Unknown error");
			setQRCode("");
		} finally {
			setIsGeneratingQR(false);
		}
	};

	const handleCopyLink = async () => {
		const bankCode = register("bankCode").name;
		const accountNumber = register("accountNumber").name;

		if (!bankCode || !accountNumber) return;

		const link = vietqrService.getPaymentLink({
			bankCode,
			accountNumber,
			amount: watchAmount || 50000,
		});

		try {
			await navigator.clipboard.writeText(link);
			alert(t("donation.copied"));
		} catch {
			console.error("Failed to copy");
		}
	};

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-8">
			<div className="grid gap-8 md:grid-cols-2">
				{/* Form */}
				<div>
					<h3 className="mb-6 text-2xl font-bold text-gray-800">
						{t("donation.bankTitle")}
					</h3>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						{/* Bank Selection */}
						<div>
							<label
								htmlFor="bankCode"
								className="block text-sm font-medium text-gray-700"
							>
								{t("donation.bankPlaceholder")}
							</label>
							<select
								{...register("bankCode")}
								id="bankCode"
								disabled
								className={`mt-1 w-full rounded-lg border px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 bg-gray-100 cursor-not-allowed ${
									errors.bankCode
										? "border-red-500 focus:border-red-500 focus:ring-red-500"
										: "border-gray-300 focus:border-green-500 focus:ring-green-500"
								}`}
							>
								<option value="">{t("donation.bankPlaceholder")}</option>
								{banks.map((bank) => (
									<option key={bank.id} value={bank.id}>
										{bank.code} - {bank.name}
									</option>
								))}
							</select>
							{errors.bankCode && (
								<p className="mt-1 text-sm text-red-500">
									{errors.bankCode.message}
								</p>
							)}
						</div>

						{/* Account Number */}
						<div>
							<label
								htmlFor="accountNumber"
								className="block text-sm font-medium text-gray-700"
							>
								{t("donation.accountNumber")}
							</label>
							<input
								{...register("accountNumber")}
								id="accountNumber"
								type="text"
								placeholder="0123456789"
								disabled
								readOnly
								className={`mt-1 w-full rounded-lg border px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 bg-gray-100 cursor-not-allowed ${
									errors.accountNumber
										? "border-red-500 focus:border-red-500 focus:ring-red-500"
										: "border-gray-300 focus:border-green-500 focus:ring-green-500"
								}`}
							/>
							{errors.accountNumber && (
								<p className="mt-1 text-sm text-red-500">
									{errors.accountNumber.message}
								</p>
							)}
						</div>

						{/* Your Name */}
						<div>
							<label
								htmlFor="yourName"
								className="block text-sm font-medium text-gray-700"
							>
								{t("donation.yourName")}
							</label>
							<input
								{...register("yourName")}
								id="yourName"
								type="text"
								placeholder={t("donation.yourNamePlaceholder")}
								className={`mt-1 w-full rounded-lg border px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 ${
									errors.yourName
										? "border-red-500 focus:border-red-500 focus:ring-red-500"
										: "border-gray-300 focus:border-green-500 focus:ring-green-500"
								}`}
							/>
							{errors.yourName && (
								<p className="mt-1 text-sm text-red-500">
									{errors.yourName.message}
								</p>
							)}
						</div>

						{/* Amount */}
						<div>
							<label
								htmlFor="amount"
								className="block text-sm font-medium text-gray-700"
							>
								{t("donation.amount")}
							</label>
							<div className="relative mt-1">
								<input
									{...register("amount", { valueAsNumber: true })}
									id="amount"
									type="number"
									placeholder="50000"
									min="1000"
									step="1000"
									className={`w-full rounded-lg border px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 ${
										errors.amount
											? "border-red-500 focus:border-red-500 focus:ring-red-500"
											: "border-gray-300 focus:border-green-500 focus:ring-green-500"
									}`}
								/>
							</div>
							{errors.amount && (
								<p className="mt-1 text-sm text-red-500">
									{errors.amount.message}
								</p>
							)}
						</div>

						{/* Buttons */}
						<div className="flex gap-3 pt-4">
							<button
								type="submit"
								disabled={isGeneratingQR}
								className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700 disabled:bg-gray-400"
							>
								{isGeneratingQR
									? t("donation.generating")
									: t("donation.generateQr")}
							</button>
							<button
								type="button"
								onClick={handleCopyLink}
								className="flex-1 rounded-lg border border-green-600 px-4 py-2 font-semibold text-green-600 transition-colors hover:bg-green-50"
							>
								{t("donation.copyLink")}
							</button>
						</div>
					</form>
				</div>

				{/* QR Code Display */}
				<div className="flex flex-col items-center justify-center">
					{qrCode ? (
						<div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
							<img
								src={qrCode}
								alt="Payment QR Code"
								className="h-48 w-48 rounded-lg"
							/>
							<p className="mt-4 text-center text-sm text-gray-600">
								{t("donation.autoEmail")}
							</p>
						</div>
					) : (
						<div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
							<div className="text-4xl">📱</div>
							<p className="mt-4 text-gray-600">{t("donation.subtitle")}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
