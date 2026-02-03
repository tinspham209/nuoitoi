import { create } from "zustand";
import type { DonationStats } from "@/types/index";

interface DonationStore {
	// Stats
	stats: DonationStats;
	setStats: (stats: DonationStats) => void;

	// QR Data
	selectedBankCode: string;
	accountNumber: string;
	amount: number;
	qrCode: string | null;
	isGeneratingQR: boolean;
	qrError: string | null;

	// Actions
	setSelectedBank: (bankCode: string) => void;
	setAccountNumber: (accountNumber: string) => void;
	setAmount: (amount: number) => void;
	setQRCode: (qrCode: string) => void;
	setIsGeneratingQR: (loading: boolean) => void;
	setQRError: (error: string | null) => void;
	resetQRForm: () => void;
}

export const useDonationStore = create<DonationStore>((set) => ({
	// Initial stats
	stats: {
		totalReceived: 590250,
		totalDonations: 11,
		monthlyGoal: 10000000,
		expenses: 1000000,
		remaining: -409750,
	},

	setStats: (stats) => set({ stats }),

	// Initial QR data
	selectedBankCode: "",
	accountNumber: "",
	amount: 50000,
	qrCode: null,
	isGeneratingQR: false,
	qrError: null,

	// Actions
	setSelectedBank: (bankCode) => set({ selectedBankCode: bankCode }),
	setAccountNumber: (accountNumber) => set({ accountNumber }),
	setAmount: (amount) => set({ amount }),
	setQRCode: (qrCode) => set({ qrCode }),
	setIsGeneratingQR: (isGeneratingQR) => set({ isGeneratingQR }),
	setQRError: (qrError) => set({ qrError }),

	resetQRForm: () =>
		set({
			selectedBankCode: "",
			accountNumber: "",
			amount: 50000,
			qrCode: null,
			qrError: null,
		}),
}));
