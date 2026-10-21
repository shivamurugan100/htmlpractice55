
import { ExpenseManager } from "./expenseManager.js";

import {
    saveExpenses,
    loadExpenses,
    saveBudget,
    loadBudget,
    exportJSON,
    readJSONFile
} from "./storage.js";

import { convertINRtoUSD } from "./currency.js";

// ---------- DOM ELEMENTS ----------

const expenseForm = document.getElementById("expenseForm");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const expenseDate = document.getElementById("expenseDate");
const formMessage = document.getElementById("formMessage");

const budgetForm = document.getElementById("budgetForm");
const budgetInput = document.getElementById("budgetInput");

const monthlySpending = document.getElementById("monthlySpending");
const monthlyCount = document.getElementById("monthlyCount");
const remainingBudget = document.getElementById("remainingBudget");
const budgetStatus = document.getElementById("budgetStatus");
const budgetWarning = document.getElementById("budgetWarning");
const budgetProgressText = document.getElementById("budgetProgressText");
const budgetPercent = document.getElementById("budgetPercent");
const budgetProgressBar = document.getElementById("budgetProgressBar");

const expenseTableBody = document.getElementById("expenseTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const tableCount = document.getElementById("tableCount");
const tableTotal = document.getElementById("tableTotal");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortOrder = document.getElementById("sortOrder");

const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const clearAllBtn = document.getElementById("clearAllBtn");

const usdAmount = document.getElementById("usdAmount");
const convertBtn = document.getElementById("convertBtn");
const currencyMessage = document.getElementById("currencyMessage");

// ---------- HELPER FUNCTIONS ----------

function formatINR(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatUSD(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}

function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className =
        type === "success" ? "success-message" : "error-message";
}

function saveCurrentData() {
    try {
        saveExpenses(manager.expenses);
        saveBudget(budget);
    } catch (error) {
        console.error("Storage error:", error);
        alert("Unable to save data. Check your browser storage.");
    }
}

// ---------- RESTORE SAVED DATA ----------

let manager;
let budget = 0;

try {
    const savedExpenses = loadExpenses();
    const savedBudget = loadBudget();

    manager = new ExpenseManager();
    manager.replaceExpenses(savedExpenses);
    budget = savedBudget;
} catch (error) {
    console.error("Could not restore saved data:", error);

    manager = new ExpenseManager();
    budget = 0;

    alert(
        "Some saved data could not be loaded. " +
        "The application has started with empty data."
    );
}

expenseDate.value = getLocalDate();
budgetInput.value = budget > 0 ? budget : "";

// ---------- DASHBOARD ----------

function updateDashboard() {
    const monthlyExpenses = manager.getCurrentMonthExpenses();

    const spending = monthlyExpenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );

    const count = monthlyExpenses.length;
    const remaining = budget - spending;
    const percentage = budget > 0 ? (spending / budget) * 100 : 0;

    monthlySpending.textContent = formatINR(spending);
    monthlyCount.textContent = count;
    remainingBudget.textContent = formatINR(remaining);

    if (budget <= 0) {
        budgetStatus.textContent = "Set your monthly budget";
        budgetWarning.hidden = true;
    } else if (spending > budget) {
        budgetStatus.textContent = "Budget exceeded!";
        budgetWarning.textContent =
            `You are over budget by ${formatINR(spending - budget)}.`;
        budgetWarning.hidden = false;
    } else if (spending === budget) {
        budgetStatus.textContent = "You have used your full budget.";
        budgetWarning.hidden = true;
    } else {
        budgetStatus.textContent = "You are within your budget.";
        budgetWarning.hidden = true;
    }

    budgetProgressText.textContent =
        `${formatINR(spending)} spent out of ${formatINR(budget)}`;

    // Show the real percentage, even if it is above 100%.
    budgetPercent.textContent =
        budget > 0 ? `${percentage.toFixed(1)}%` : "Set budget";

    // The progress bar cannot visually extend beyond 100%.
    budgetProgressBar.style.width =
        `${Math.min(percentage, 100)}%`;

    budgetProgressBar.classList.toggle(
        "over-budget",
        budget > 0 && spending > budget
    );
}

// ---------- EXPENSE TABLE ----------

function renderExpenses() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const order = sortOrder.value;

    let displayedExpenses = manager.expenses.filter(expense =>
        expense.name.toLowerCase().includes(searchText)
    );

    if (selectedCategory !== "All") {
        displayedExpenses = displayedExpenses.filter(
            expense => expense.category === selectedCategory
        );
    }

    displayedExpenses.sort((a, b) => {
        if (order === "oldest") {
            return a.date.localeCompare(b.date) ||
                a.id.localeCompare(b.id);
        }

        return b.date.localeCompare(a.date) ||
            b.id.localeCompare(a.id);
    });

    expenseTableBody.replaceChildren();

    for (const expense of displayedExpenses) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const nameText = document.createElement("span");
        nameText.className = "expense-name";
        nameText.textContent = expense.name;
        nameCell.appendChild(nameText);

        const categoryCell = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = `category-badge category-${expense.category}`;
        badge.textContent = expense.category;
        categoryCell.appendChild(badge);

        const dateCell = document.createElement("td");
        dateCell.textContent = new Date(
            expense.date + "T00:00:00"
        ).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

        const amountCell = document.createElement("td");
        amountCell.className = "amount";
        amountCell.textContent = formatINR(expense.amount);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            const confirmed = confirm(
                `Delete "${expense.name}"?`
            );

            if (!confirmed) {
                return;
            }

            manager.deleteExpense(expense.id);
            saveCurrentData();
            refreshApp();
        });

        actionCell.appendChild(deleteButton);

        row.append(
            nameCell,
            categoryCell,
            dateCell,
            amountCell,
            actionCell
        );

        expenseTableBody.appendChild(row);
    }

    emptyMessage.hidden = displayedExpenses.length > 0;

    if (displayedExpenses.length === 0) {
        emptyMessage.textContent =
            manager.expenses.length === 0
                ? "No expenses yet. Add your first expense above."
                : "No expenses match your search or filter.";
    }

    tableCount.textContent =
        `${displayedExpenses.length} expense` +
        `${displayedExpenses.length === 1 ? "" : "s"}`;

    const visibleTotal = displayedExpenses.reduce(
        (total, expense) => total + expense.amount,
        0
    );

    tableTotal.textContent = `Total: ${formatINR(visibleTotal)}`;
}

// ---------- REFRESH ALL VIEWS ----------

function refreshApp() {
    updateDashboard();
    renderExpenses();
}

// ---------- ADD EXPENSE ----------

expenseForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;
    const date = expenseDate.value;

    if (!name) {
        showFormMessage("Please enter an expense name.", "error");
        expenseName.focus();
        return;
    }

    if (
        expenseAmount.value.trim() === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        showFormMessage(
            "Enter an amount greater than zero.",
            "error"
        );
        expenseAmount.focus();
        return;
    }

    try {
        manager.addExpense(name, amount, category, date);

        saveCurrentData();

        expenseForm.reset();
        expenseDate.value = getLocalDate();

        showFormMessage(
            "Expense added successfully!",
            "success"
        );

        refreshApp();
    } catch (error) {
        showFormMessage(error.message, "error");
    }
});

// ---------- SET MONTHLY BUDGET ----------

budgetForm.addEventListener("submit", event => {
    event.preventDefault();

    const newBudget = Number(budgetInput.value);

    if (
        budgetInput.value.trim() === "" ||
        !Number.isFinite(newBudget) ||
        newBudget <= 0
    ) {
        alert("Enter a budget greater than zero.");
        return;
    }

    budget = Math.round(newBudget * 100) / 100;
    saveCurrentData();
    updateDashboard();

    alert("Monthly budget saved successfully!");
});

// ---------- SEARCH, FILTER AND SORT ----------

searchInput.addEventListener("input", renderExpenses);
categoryFilter.addEventListener("change", renderExpenses);
sortOrder.addEventListener("change", renderExpenses);

// ---------- EXPORT JSON ----------

exportBtn.addEventListener("click", () => {
    try {
        exportJSON(manager.expenses, budget);
    } catch (error) {
        alert("Could not export JSON: " + error.message);
    }
});

// ---------- IMPORT JSON ----------

importFile.addEventListener("change", async () => {
    const file = importFile.files[0];

    if (!file) {
        return;
    }

    try {
        const data = await readJSONFile(file);

        // Validate everything before asking to replace existing data.
        const newManager = new ExpenseManager();
        newManager.replaceExpenses(data.expenses);

        const newBudget = Math.round(data.budget * 100) / 100;

        const confirmed = confirm(
            `Import ${newManager.expenses.length} expenses and ` +
            `a budget of ${formatINR(newBudget)}?\n\n` +
            "This will replace your existing expenses and budget."
        );

        if (!confirmed) {
            return;
        }

        // Save the validated data before replacing the current view.
        saveExpenses(newManager.expenses);
        saveBudget(newBudget);

        manager = newManager;
        budget = newBudget;
        budgetInput.value = budget > 0 ? budget : "";

        refreshApp();

        alert("SpendSmart data imported successfully!");
    } catch (error) {
        alert("Import failed: " + error.message);
    } finally {
        importFile.value = "";
    }
});

// ---------- CLEAR ALL EXPENSES ----------

clearAllBtn.addEventListener("click", () => {
    if (manager.expenses.length === 0) {
        alert("There are no expenses to clear.");
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete ALL expenses?\n\n" +
        "Your monthly budget will be retained."
    );

    if (!confirmed) {
        return;
    }

    manager.clearAll();

    // Save empty expenses without changing the budget.
    saveCurrentData();
    refreshApp();

    usdAmount.textContent = "Not loaded";
    currencyMessage.textContent =
        "Expenses cleared. Update the rate to refresh the conversion.";

    alert("All expenses have been cleared. Your budget is unchanged.");
});

// ---------- INR TO USD CONVERSION ----------

async function updateCurrencyConversion() {
    convertBtn.disabled = true;
    convertBtn.textContent = "Loading...";
    currencyMessage.textContent = "Fetching the latest available rate...";

    try {
        const spending = manager.getMonthlySpending();
        const result = await convertINRtoUSD(spending);

        usdAmount.textContent = formatUSD(result.usd);

        currencyMessage.textContent =
            `1 INR = ${result.rate.toFixed(6)} USD. ` +
            `Rate timestamp: ${result.updatedAt}.`;
    } catch (error) {
        usdAmount.textContent = "Unavailable";
        currencyMessage.textContent =
            "Conversion failed. Check your internet connection and try again.";

        console.error("Currency conversion error:", error);
    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = "↻ Update rate";
    }
}

convertBtn.addEventListener("click", updateCurrencyConversion);

// ---------- INITIALIZE APP ----------

document.getElementById("todayText").textContent =
    new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

refreshApp();
updateCurrencyConversion();
