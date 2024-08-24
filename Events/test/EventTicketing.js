const { expect } = require("chai");

const NAME = "Concert"
const SYMBOL = "Con"

const OCCASION_NAME = "Enugu Tech meet-up"
const OCCASION_COST = ethers.parseUnits('1', 'ether')
const OCCASION_MAX_TICKETS = 100
const OCCASION_DATE = "Sept 27"
const OCCASION_TIME = "10:00AM WAT"
const OCCASION_LOCATION = "Enugu, NIgeria"

describe("EventTicketing", () => {
  let eventTickering;
  let deployer, buyer;



  beforeEach(async () => {
    //setup accounts
    [deployer, buyer] = await ethers.getSigners()

    const EventTicketing = await ethers.getContractFactory("EventTicketing");
    eventTickering = await EventTicketing.deploy(NAME, SYMBOL);

    const transaction = await eventTickering.connect(deployer).list(
      OCCASION_NAME,
      OCCASION_COST,
      OCCASION_MAX_TICKETS,
      OCCASION_DATE,
      OCCASION_TIME,
      OCCASION_LOCATION,
    )

    await transaction.wait()
  });

  describe("Deployment", () => {
    it("Sets the name", async () => {
      expect(await eventTickering.name()).to.equal(NAME);
    });

    it("Sets the symbol", async () => {
      expect(await eventTickering.symbol()).to.equal(SYMBOL);
    });

    it("sets the owner", async () => {
      expect(await eventTickering.owner()).to.equal(deployer.address)
    });

  });
  describe("Occasions", () => {
    it("updates occasions count", async () => {
      const totalOccasions = await eventTickering.totalOccasions();
      expect(totalOccasions).to.be.equal(1)
    })
    it('Returns occasions attributes', async () => {
      const occasion = await eventTickering.getOccasion(1)
      expect(occasion.id).to.be.equal(1)
      expect(occasion.name).to.be.equal(OCCASION_NAME)
      expect(occasion.cost).to.be.equal(OCCASION_COST)
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS)
      expect(occasion.date).to.be.equal(OCCASION_DATE)
      expect(occasion.time).to.be.equal(OCCASION_TIME)
      expect(occasion.location).to.be.equal(OCCASION_LOCATION)
    })
  })

  describe("Minting", () => {
    const ID = 1
    const SEAT = 50
    const AMOUNT = ethers.parseUnits('1', 'ether')

    beforeEach(async () => {
      const transaction = await eventTickering.connect(buyer).mint(ID, SEAT, {value: AMOUNT})
      await transaction.wait()
    })

    it("updates ticket count", async () => {
      const occasion = await eventTickering.getOccasion(1)
      expect(occasion.tickets).to.be.equal(OCCASION_MAX_TICKETS -1)
    })

    it("updates buying status", async () => {
      const status = await eventTickering.hasBought(ID, buyer.address)
      expect(status).to.be.equal(true)
    })

    it("updates seat status", async () => {
      const owner = await eventTickering.seatTaken(ID, SEAT)
      expect(owner).to.equal(buyer.address)
    })

    it('updates overall seating status', async () => {
      const seats = await eventTickering.getSeatsTaken(ID)
      expect(seats.length).to.equal(1)
      expect(seats[0]).to.equal(SEAT)
    })

    it('Updates the contract balance', async () => {
      const balance = await ethers.provider.getBalance(eventTickering.target);
      expect(balance).to.equal(AMOUNT);
    })
    
    describe("Withdrawing", () => {
      const ID = 1
      const SEAT = 50
      const AMOUNT = ethers.parseUnits("1", 'ether')
      let balanceBefore

      beforeEach(async () => {
        balanceBefore =  deployer.provider.getBalance(deployer.address);
        let transaction = await eventTickering.connect(buyer).mint(ID, SEAT, { value: AMOUNT})
        await transaction.wait()

        transaction = await eventTickering.connect(deployer).withdraw()
        await transaction.wait()
      })

      it("Update the owner balance", async () => {
        const balanceAfter = deployer.provider.getBalance(deployer.address);
        expect(balanceAfter).to.be.greaterThan(balanceBefore)
      })

      it("Update the contract balance", async () => {
        const balance = await ethers.provider.getBalance(eventTickering.target)
        expect(balance).to.equal(0)
      })
    })
  })
});
