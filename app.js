const rewards = [
    { name: "Free Drink", value: 5, weight: 15 },
    { name: "10% Discount", value: 7, weight: 25 },
    { name: "Free Dessert", value: 8, weight: 10 },
    { name: "No Reward", value: 0, weight: 50 }
];

const form = document.getElementById("simulator-form");
const rerunBtn = document.getElementById("rerunBtn");
const resetBtn = document.getElementById("resetBtn");

function money(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(value);
}

function expectedRewardValue() {
    const totalWeight = rewards.reduce((sum, reward) => sum + reward.weight, 0);

    return rewards.reduce((sum, reward) => {
        return sum + reward.value * (reward.weight / totalWeight);
    }, 0);
}

function simulate() {
    const budget = Number(document.getElementById("budget").value || 0);
    const claims = Number(document.getElementById("claims").value || 0);
    const orderValue = Number(document.getElementById("orderValue").value || 0);
    const lift = Number(document.getElementById("lift").value || 0);

    const avgReward = expectedRewardValue();
    const totalPayout = avgReward * claims;
    const remainingBudget = budget - totalPayout;
    const projectedRevenueLift = claims * orderValue * (lift / 100);
    const budgetUsedPercent = budget > 0 ? Math.min((totalPayout / budget) * 100, 140) : 0;

    document.getElementById("totalPayout").textContent = money(totalPayout);
    document.getElementById("remainingBudget").textContent = money(remainingBudget);
    document.getElementById("avgPayout").textContent = money(avgReward);
    document.getElementById("revenueLift").textContent = money(projectedRevenueLift);
    document.getElementById("claimCountBadge").textContent = `${claims} claims`;
    document.getElementById("budgetBar").style.width = `${Math.min(budgetUsedPercent, 100)}%`;

    let riskLabel = "Safe";
    let riskBadge = "Safe";
    let riskMessage = "Reward spend is within a safer operating range. Campaign can continue with normal monitoring.";

    if (remainingBudget < 0) {
        riskLabel = "Over Budget";
        riskBadge = "Critical";
        riskMessage = "Projected reward payout exceeds the available campaign budget. Reduce claim volume, lower reward value, or increase budget.";
    } else if (budgetUsedPercent > 75) {
        riskLabel = "Watchlist";
        riskBadge = "Watch";
        riskMessage = "Reward spend is approaching the budget ceiling. Review reward mix before expanding campaign reach.";
    }

    document.getElementById("riskLabel").textContent = riskLabel;
    document.getElementById("riskBadge").textContent = riskBadge;
    document.getElementById("riskMessage").textContent = riskMessage;
    document.getElementById("scenarioStatus").textContent = riskLabel;
    document.getElementById("scenarioSummary").textContent =
        `${claims} expected claims create ${money(totalPayout)} in projected reward cost with ${money(remainingBudget)} remaining.`;

    renderRewards(claims);
}

function renderRewards(claims) {
    const rewardList = document.getElementById("rewardList");
    const totalWeight = rewards.reduce((sum, reward) => sum + reward.weight, 0);

    rewardList.innerHTML = rewards.map(reward => {
        const percent = Math.round((reward.weight / totalWeight) * 100);
        const expectedClaims = Math.round(claims * (reward.weight / totalWeight));

        return `
            <div class="reward-row">
                <div>
                    <strong>${reward.name}</strong>
                    <span>${expectedClaims} expected claims · ${money(reward.value)} value</span>
                </div>
                <div class="reward-meter">
                    <div style="width:${percent}%"></div>
                </div>
                <b>${percent}%</b>
            </div>
        `;
    }).join("");
}

form.addEventListener("submit", event => {
    event.preventDefault();
    simulate();
});

rerunBtn.addEventListener("click", simulate);

resetBtn.addEventListener("click", () => {
    document.getElementById("budget").value = 1000;
    document.getElementById("claims").value = 250;
    document.getElementById("orderValue").value = 28;
    document.getElementById("lift").value = 12;
    simulate();
});

simulate();
