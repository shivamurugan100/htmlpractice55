
export async function convertINRtoUSD(amountInINR) {
    if (!Number.isFinite(amountInINR) || amountInINR < 0) {
        throw new Error("Invalid amount for currency conversion.");
    }

    const response = await fetch(
        "https://open.er-api.com/v6/latest/INR"
    );

    if (!response.ok) {
        throw new Error("Could not connect to the exchange-rate service.");
    }

    const data = await response.json();

    if (
        data.result !== "success" ||
        !data.rates ||
        !Number.isFinite(data.rates.USD) ||
        data.rates.USD <= 0
    ) {
        throw new Error("Exchange rate data is unavailable.");
    }

    return {
        usd: amountInINR * data.rates.USD,
        rate: data.rates.USD,
        updatedAt: data.time_last_update_utc
    };
}
