import * as yup from "yup";

export const donationFormSchema = yup.object({
	bankCode: yup
		.string()
		.required("Bank is required")
		.min(1, "Please select a bank"),
	accountNumber: yup
		.string()
		.required("Account number is required")
		.matches(/^\d+$/, "Account number must contain only digits")
		.min(10, "Account number must be at least 10 digits")
		.max(20, "Account number must be at most 20 digits"),
	yourName: yup
		.string()
		.required("Your name is required")
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be at most 50 characters"),
	amount: yup
		.number()
		.required("Amount is required")
		.positive("Amount must be greater than 0")
		.min(1000, "Minimum amount is 1,000 VND")
		.max(999999999, "Maximum amount is 999,999,999 VND"),
});

export type DonationFormData = yup.InferType<typeof donationFormSchema>;
