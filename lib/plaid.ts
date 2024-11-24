import axios from "axios";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

// Configuration for Plaid
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Adjust to 'development' or 'production' if needed
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
      "PLAID-SECRET": process.env.PLAID_SECRET!,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

/**
 * Add user consent for the required product(s).
 * @param {string} accessToken - The access token for the user.
 * @param {string[]} products - Products to add consent for (e.g., ['transactions']).
 */
export const addProductConsent = async ({
  accessToken,
  products,
}: {
  accessToken: string;
  products: string[];
}) => {
  try {
    const response = await axios.post(
      "https://sandbox.plaid.com/item/consent/update",
      {
        access_token: accessToken,
        products,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
          "PLAID-SECRET": process.env.PLAID_SECRET!,
        },
      }
    );

    console.log("Consent added successfully:", response.data);
    return response.data;
  } catch (error) {
    // Check if error is an AxiosError
    if (axios.isAxiosError(error)) {
      console.error("AxiosError adding consent:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error adding consent:", error);
    }

    throw new Error("Failed to add product consent.");
  }
};
