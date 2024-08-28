const hre = require("hardhat")

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners()
  const NAME = "concert"
  const SYMBOL = "con"

  // Deploy contract
  const EventTicketing = await ethers.getContractFactory("EventTicketing");
  const eventTickering = await EventTicketing.deploy(NAME, SYMBOL);
  await eventTickering.waitForDeployment();

  console.log(`Deployed eventTickering Contract at: ${eventTickering.target}\n`)

  // List 6 events
  const occasions = [
    {
      name: "Google dev meet",
      cost: tokens(3),
      tickets: 0,
      date: "May 31",
      time: "1:00PM GMT",
      location: "Lagos, Nigeria"
    },
    {
      name: "Enugu Tech meetup",
      cost: tokens(1),
      tickets: 125,
      date: "Jun 2",
      time: "1:00PM GMT",
      location: "Enugu, Nigeria"
    },
    {
      name: "Asset chain Hackathon",
      cost: tokens(0.25),
      tickets: 200,
      date: "Jun 9",
      time: "10:00AM GMT",
      location: "Port Harcourt, Nigeria"
    },
    {
      name: "West Music Concert",
      cost: tokens(5),
      tickets: 0,
      date: "Jun 11",
      time: "2:30PM GMT",
      location: "Abuja, Nigeria"
    },
    {
      name: "Calabar Cannival",
      cost: tokens(1.5),
      tickets: 125,
      date: "Jun 23",
      time: "11:00AM GMT",
      location: "Calabar, Nigeria"
    }
  ]

  for (var i = 0; i < 5; i++) {
    const transaction = await eventTickering.connect(deployer).list(
      occasions[i].name,
      occasions[i].cost,
      occasions[i].tickets,
      occasions[i].date,
      occasions[i].time,
      occasions[i].location,
    )

    await transaction.wait()

    console.log(`Listed Event ${i + 1}: ${occasions[i].name}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});