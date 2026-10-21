
const EXPENSES_KEY = "spendsmart_expenses";
const BUDGET_KEY = "spendsmart_budget";

export function saveExpenses(expenses) {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

export function loadExpenses() {
    const savedData = localStorage.getItem(EXPENSES_KEY);

    if (savedData === null) {
        return [];
    }

    const expenses = JSON.parse(savedData);

    if (!Array.isArray(expenses)) {
        throw new Error("Saved expense data is invalid.");
    }

    return expenses;
}

export function saveBudget(budget) {
    localStorage.setItem(BUDGET_KEY, String(budget));
}

export function loadBudget() {
    const savedBudget = localStorage.getItem(BUDGET_KEY);

    if (savedBudget === null) {
        return 0;
    }

    const budget = Number(savedBudget);

    if (!Number.isFinite(budget) || budget < 0) {
        throw new Error("Saved budget data is invalid.");
    }

    return budget;
}

export function exportJSON(expenses, budget) {
    const data = {
        app: "SpendSmart",
        version: 1,
        exportedAt: new Date().toISOString(),
        budget: budget,
        expenses: expenses
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "spendsmart-data.json";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

export function readJSONFile(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("Please select a JSON file."));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            reject(new Error("File is too large. Maximum size is 5 MB."));
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);

                if (
                    data === null ||
                    typeof data !== "object" ||
                    Array.isArray(data) ||
                    data.app !== "SpendSmart" ||
                    data.version !== 1 ||
                    !Array.isArray(data.expenses) ||
                    typeof data.budget !== "number" ||
                    !Number.isFinite(data.budget) ||
                    data.budget < 0
                ) {
                    throw new Error(
                        "Invalid SpendSmart JSON file structure."
                    );
                }

                resolve(data);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error("Unable to read the selected file."));
        };

        reader.readAsText(file);
    });
}
