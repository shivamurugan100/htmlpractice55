
const CATEGORIES = ["Food", "Travel", "Shopping", "Other"];

export class ExpenseManager {
    constructor(expenses = []) {
        this.expenses = expenses;
    }

    addExpense(name, amount, category, date) {
        name = name.trim();

        if (!name) {
            throw new Error("Please enter an expense name.");
        }

        if (name.length > 100) {
            throw new Error("Expense name must be 100 characters or fewer.");
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            throw new Error("Amount must be greater than zero.");
        }

        if (!CATEGORIES.includes(category)) {
            throw new Error("Please select a valid category.");
        }

        if (!ExpenseManager.isValidDate(date)) {
            throw new Error("Please select a valid date.");
        }

        const expense = {
            id: crypto.randomUUID(),
            name: name,
            amount: Math.round(amount * 100) / 100,
            category: category,
            date: date
        };

        this.expenses.push(expense);
        return expense;
    }

    deleteExpense(id) {
        const oldLength = this.expenses.length;

        this.expenses = this.expenses.filter(
            expense => expense.id !== id
        );

        return this.expenses.length < oldLength;
    }

    clearAll() {
        this.expenses = [];
    }

    searchExpenses(searchText) {
        const search = searchText.trim().toLowerCase();

        return this.expenses.filter(expense =>
            expense.name.toLowerCase().includes(search)
        );
    }

    filterByCategory(category) {
        if (category === "All") {
            return [...this.expenses];
        }

        return this.expenses.filter(
            expense => expense.category === category
        );
    }

    sortByDate(order = "newest") {
        return [...this.expenses].sort((a, b) => {
            if (order === "oldest") {
                return a.date.localeCompare(b.date) ||
                    a.id.localeCompare(b.id);
            }

            return b.date.localeCompare(a.date) ||
                b.id.localeCompare(a.id);
        });
    }

    getCurrentMonthExpenses() {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const yearMonth = `${today.getFullYear()}-${month}`;

        return this.expenses.filter(expense =>
            expense.date.startsWith(yearMonth)
        );
    }

    getMonthlySpending() {
        return this.getCurrentMonthExpenses().reduce(
            (total, expense) => total + expense.amount,
            0
        );
    }

    getMonthlyCount() {
        return this.getCurrentMonthExpenses().length;
    }

    static isValidDate(date) {
        if (typeof date !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return false;
        }

        const parsed = new Date(date + "T00:00:00Z");

        return !Number.isNaN(parsed.getTime()) &&
            parsed.toISOString().slice(0, 10) === date;
    }

    static validateImportedExpense(expense) {
        return expense !== null &&
            typeof expense === "object" &&
            !Array.isArray(expense) &&
            (typeof expense.id === "string" ||
                typeof expense.id === "number") &&
            String(expense.id).length > 0 &&
            typeof expense.name === "string" &&
            expense.name.trim().length > 0 &&
            expense.name.trim().length <= 100 &&
            typeof expense.amount === "number" &&
            Number.isFinite(expense.amount) &&
            expense.amount > 0 &&
            CATEGORIES.includes(expense.category) &&
            ExpenseManager.isValidDate(expense.date);
    }

    replaceExpenses(expenses) {
        if (!Array.isArray(expenses)) {
            throw new Error("Imported expenses must be an array.");
        }

        if (!expenses.every(ExpenseManager.validateImportedExpense)) {
            throw new Error("The JSON contains invalid expense records.");
        }

        const ids = expenses.map(expense => String(expense.id));

        if (new Set(ids).size !== ids.length) {
            throw new Error("The JSON contains duplicate expense IDs.");
        }

        this.expenses = expenses.map(expense => ({
            id: String(expense.id),
            name: expense.name.trim(),
            amount: Math.round(expense.amount * 100) / 100,
            category: expense.category,
            date: expense.date
        }));
    }
}
