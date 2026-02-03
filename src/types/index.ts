export interface Bank {
	id: string;
	name: string;
	code: string;
	shortName: string;
}

export interface QRGenerateRequest {
	bankCode: string;
	accountNumber: string;
	amount: number;
	accountName?: string;
	description?: string;
}

export interface QRGenerateResponse {
	qrCode: string;
	url?: string;
	error?: string;
}

export interface DonationStats {
	totalReceived: number;
	totalDonations: number;
	monthlyGoal: number;
	expenses: number;
	remaining: number;
}
