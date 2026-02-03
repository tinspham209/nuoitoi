import type {
	Bank,
	QRGenerateRequest,
	QRGenerateResponse,
} from "@/types/index";

// VietQR API v1 implementation
// Documentation: https://api.vietqr.io/

const API_BASE_URL =
	import.meta.env.VITE_VIETQR_API_URL || "https://api.vietqr.io/v1";

interface VietQRBank {
	id: number;
	name: string;
	code: string;
	bin: string;
	shortName: string;
	logo: string;
	transferSupported: number;
	lookupSupported: number;
}

class VietQRService {
	/**
	 * Get list of supported banks
	 */
	async getBanks(): Promise<Bank[]> {
		try {
			const response = await fetch(`${API_BASE_URL}/banks`);
			if (!response.ok) {
				throw new Error(`Failed to fetch banks: ${response.statusText}`);
			}
			const data = await response.json();

			return (data.data || []).map((bank: VietQRBank) => ({
				id: bank.id.toString(),
				name: bank.name,
				code: bank.code,
				shortName: bank.shortName,
			}));
		} catch (error) {
			console.error("Error fetching banks:", error);
			// Return empty array on error
			return [];
		}
	}

	/**
	 * Generate QR code for bank transfer
	 * Uses VietQR's generate endpoint to create payment QR codes
	 */
	async generateQR(request: QRGenerateRequest): Promise<QRGenerateResponse> {
		try {
			// VietQR API v1 endpoint for generating QR codes
			const queryParams = new URLSearchParams({
				bankBin: request.bankCode || "TCB",
				accountNumber: request.accountNumber || "1234200999",
				amount: request.amount.toString(),
				accountName: request.accountName || "1234200999",
				description: request.description || "Nuoi Toi Donation",
			});

			const url = `${API_BASE_URL}/generate?${queryParams.toString()}`;

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Failed to generate QR: ${response.statusText}`);
			}

			const data = await response.json();

			if (data.code === "00" && data.data?.qrDataURL) {
				return {
					qrCode: data.data.qrDataURL,
					url: url,
				};
			} else {
				throw new Error(data.message || "Failed to generate QR code");
			}
		} catch (error) {
			console.error("Error generating QR:", error);
			return {
				qrCode: "",
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Alternative: Generate QR code using common bank info
	 * Fallback method if VietQR API is unavailable
	 */
	async generateQRFallback(
		request: QRGenerateRequest,
	): Promise<QRGenerateResponse> {
		try {
			// Build QR string manually for bank transfers
			// Format: |paymentType|recipientName|bankAccountNumber|amount|description|
			const qrString = `|1|${request.accountName || "NUOI TOI"}|${request.accountNumber}|${request.amount}|${request.description || "Donation"}|`;

			// In a real implementation, you would generate QR code image
			// For now, return the data as-is
			return {
				qrCode: qrString,
			};
		} catch (error) {
			console.error("Error in fallback QR generation:", error);
			return {
				qrCode: "",
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	/**
	 * Get payment link for bank transfer
	 * Useful for deep linking to banking apps
	 */
	getPaymentLink(request: QRGenerateRequest): string {
		const params = new URLSearchParams({
			bankBin: request.bankCode,
			accountNumber: request.accountNumber,
			amount: request.amount.toString(),
			accountName: request.accountName || "NUOI TOI",
			description: request.description || "Nuoi Toi Donation",
		});

		return `${API_BASE_URL}/generate?${params.toString()}`;
	}
}

export const vietqrService = new VietQRService();
