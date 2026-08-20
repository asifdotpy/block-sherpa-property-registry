const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyRegistry", function () {
  let registry;
  let owner;
  let other;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("PropertyRegistry");
    registry = await Factory.deploy();
    await registry.deployed();
  });

  it("registers a property with the caller as owner", async function () {
    await registry.registerProperty("123 Main St", 1000);

    expect(await registry.propertyCount()).to.equal(1);

    const [addr, propOwner, price] = await registry.getProperty(1);
    expect(addr).to.equal("123 Main St");
    expect(propOwner).to.equal(owner.address);
    expect(price).to.equal(1000);
  });

  it("transfers ownership to another address", async function () {
    await registry.registerProperty("123 Main St", 1000);
    await registry.transferOwnership(1, other.address);

    const [, newOwner] = await registry.getProperty(1);
    expect(newOwner).to.equal(other.address);
  });

  it("reverts when a non-owner tries to transfer", async function () {
    await registry.registerProperty("123 Main St", 1000);

    await expect(
      registry.connect(other).transferOwnership(1, other.address)
    ).to.be.revertedWithCustomError(registry, "NotOwner");
  });

  it("reverts transfer to the zero address", async function () {
    await registry.registerProperty("123 Main St", 1000);

    await expect(
      registry.transferOwnership(1, ethers.constants.AddressZero)
    ).to.be.revertedWithCustomError(registry, "ZeroAddress");
  });
});
