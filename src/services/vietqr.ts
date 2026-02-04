import type { Bank, QRGenerateRequest, QRGenerateResponse } from "@/types/index";

// VietQR API v1 implementation
// Documentation: https://www.vietqr.io/en/danh-sach-api/link-tao-ma-nhanh/

const API_BASE_URL = import.meta.env.VITE_VIETQR_API_URL || "https://api.vietqr.io/v1";

// VietQR Quick Link Image URL base
const VIETQR_IMG_URL = "https://img.vietqr.io/image";

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
	 * Generate QR code for bank transfer using VietQR Quick Link
	 * Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
	 * Documentation: https://www.vietqr.io/en/danh-sach-api/link-tao-ma-nhanh/
	 */
	async generateQR(request: QRGenerateRequest): Promise<QRGenerateResponse> {
		try {
			const bankCode = request.bankCode || "TCB";
			const accountNumber = request.accountNumber || "1234200999";
			const amount = request.amount;
			const description = request.description || "Nuoi Tin Donation";
			const accountName = request.accountName || "PHAM VAN TIN";
			const template = "compact2"; // compact2 = 540x640 with QR + logos + info

			// Encode URL parameters
			const addInfo = encodeURIComponent(description);
			const encodedAccountName = encodeURIComponent(accountName);

			// Build VietQR Quick Link URL
			// Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png
			const qrImageUrl = `${VIETQR_IMG_URL}/${bankCode}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${addInfo}&accountName=${encodedAccountName}`;

			// Return the image URL directly as the QR code
			return {
				qrCode: qrImageUrl,
				url: qrImageUrl,
			};
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
	async generateQRFallback(request: QRGenerateRequest): Promise<QRGenerateResponse> {
		try {
			// Build QR string manually for bank transfers
			// Format: |paymentType|recipientName|bankAccountNumber|amount|description|
			const qrString = `|1|${request.accountName || "PHAM VAN TIN"}|${request.accountNumber}|${request.amount}|${request.description || "Donation"}|`;

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
	 * Get payment link for bank transfer using VietQR Quick Link
	 * Returns direct image URL that can be opened in browser or shared
	 */
	getPaymentLink(request: QRGenerateRequest): string {
		const bankCode = request.bankCode || "TCB";
		const accountNumber = request.accountNumber || "1234200999";
		const amount = request.amount;
		const description = request.description || "Nuoi Tin Donation";
		const accountName = request.accountName || "PHAM VAN TIN";
		const template = "compact2";

		const addInfo = encodeURIComponent(description);
		const encodedAccountName = encodeURIComponent(accountName);

		return `${VIETQR_IMG_URL}/${bankCode}-${accountNumber}-${template}.png?amount=${amount}&addInfo=${addInfo}&accountName=${encodedAccountName}`;
	}
}

export const vietqrService = new VietQRService();
