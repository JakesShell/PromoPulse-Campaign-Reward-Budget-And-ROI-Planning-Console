const prompt = require("prompt-sync")();

const REWARD_COUNTS = {
  "Free Drink": 10,
  "10% Discount": 16,
  "Free Dessert": 6,
  "No Reward": 30,
};

const REWARD_VALUES = {
  "Free Drink": 4,
  "10% Discount": 7,
  "Free Dessert": 6,
  "No Reward": 0,
};

const rewardPool = [];

for (const [reward, count] of Object.entries(REWARD_COUNTS)) {
  for (let i = 0; i < count; i += 1) {
    rewardPool.push(reward);
  }
}

function getPositiveNumber(message) {
  while (true) {
    const value = Number(prompt(message));
    if (!Number.isNaN(value) && value > 0) {
      return value;
    }
    console.log("Invalid number, try again.");
  }
}

function getSimulationCount(balance) {
  while (true) {
    const value = Number(prompt("Enter number of reward claims to simulate: "));
    if (!Number.isNaN(value) && value > 0 && value <= balance) {
      return value;
    }
    console.log("Invalid claim count, try again.");
  }
}

function drawReward() {
  const index = Math.floor(Math.random() * rewardPool.length);
  return rewardPool[index];
}

function simulateClaims(claimCount) {
  const distribution = {
    "Free Drink": 0,
    "10% Discount": 0,
    "Free Dessert": 0,
    "No Reward": 0,
  };

  let totalPayout = 0;

  for (let i = 0; i < claimCount; i += 1) {
    const reward = drawReward();
    distribution[reward] += 1;
    totalPayout += REWARD_VALUES[reward];
  }

  return { distribution, totalPayout };
}

function printDistribution(distribution) {
  console.log();
  console.log("Reward Distribution");
  console.log("-------------------");

  for (const [reward, count] of Object.entries(distribution)) {
    console.log(`${reward}: ${count}`);
  }
}

function printSummary(claimCount, totalPayout, campaignBudget) {
  const averagePayout = totalPayout / claimCount;
  const remainingBudget = campaignBudget - totalPayout;

  console.log();
  console.log("Campaign Summary");
  console.log("----------------");
  console.log(`Simulated Claims: ${claimCount}`);
  console.log(`Total Reward Payout: $${totalPayout.toFixed(2)}`);
  console.log(`Average Payout Per Claim: $${averagePayout.toFixed(2)}`);
  console.log(`Remaining Budget: $${remainingBudget.toFixed(2)}`);

  if (remainingBudget < 0) {
    console.log("Status: Over budget. Adjust reward tiers or campaign volume.");
  } else if (remainingBudget < campaignBudget * 0.15) {
    console.log("Status: Budget risk is high. Monitor campaign closely.");
  } else {
    console.log("Status: Budget is within a safer operating range.");
  }
}

function runSimulation() {
  console.log("Promotional Reward Budget Simulator");
  console.log("-----------------------------------");

  let campaignBudget = getPositiveNumber("Enter campaign reward budget: $");

  while (true) {
    console.log();
    console.log(`Current Campaign Budget: $${campaignBudget.toFixed(2)}`);

    const claimCount = getSimulationCount(Math.max(1, Math.floor(campaignBudget)));
    const { distribution, totalPayout } = simulateClaims(claimCount);

    printDistribution(distribution);
    printSummary(claimCount, totalPayout, campaignBudget);

    campaignBudget -= totalPayout;

    if (campaignBudget <= 0) {
      console.log();
      console.log("Campaign budget exhausted.");
      break;
    }

    const again = prompt("Run another simulation round? (y/n): ").trim().toLowerCase();
    if (again !== "y") {
      break;
    }
  }

  console.log("Simulation complete.");
}

runSimulation();
