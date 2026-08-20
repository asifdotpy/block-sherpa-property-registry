// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title PropertyRegistry
/// @notice Minimal on-chain registry for real-estate properties.
///         Extends the attached real-estate platform with a verifiable
///         ownership + price record per property.
contract PropertyRegistry {
    // ---------------------------------------------------------------------
    // Types
    // ---------------------------------------------------------------------
    struct Property {
        string propertyAddress; // physical address of the property
        address owner;          // current owner (set on registration)
        uint256 price;          // listed price (uint256, chain-agnostic unit)
        bool exists;           // guards against reading unset ids
    }

    // ---------------------------------------------------------------------
    // Storage
    // ---------------------------------------------------------------------
    uint256 public propertyCount;
    mapping(uint256 => Property) private _properties;

    // ---------------------------------------------------------------------
    // Events
    // ---------------------------------------------------------------------
    event PropertyRegistered(
        uint256 indexed propertyId,
        string propertyAddress,
        address indexed owner,
        uint256 price
    );
    event OwnershipTransferred(
        uint256 indexed propertyId,
        address indexed from,
        address indexed to
    );

    // ---------------------------------------------------------------------
    // Errors (custom errors are cheaper than require-string reverts)
    // ---------------------------------------------------------------------
    error NotOwner();
    error ZeroAddress();
    error PropertyNotFound();

    // ---------------------------------------------------------------------
    // Modifiers
    // ---------------------------------------------------------------------
    modifier onlyOwner(uint256 _propertyId) {
        Property storage p = _properties[_propertyId];
        if (!p.exists) revert PropertyNotFound();
        if (p.owner != msg.sender) revert NotOwner();
        _;
    }

    // ---------------------------------------------------------------------
    // Functions
    // ---------------------------------------------------------------------

    /// @notice Register a new property. Caller becomes the owner.
    /// @param _address Physical address of the property.
    /// @param _price   Listed price for the property.
    /// @return propertyId The newly assigned id.
    function registerProperty(string memory _address, uint256 _price)
        external
        returns (uint256 propertyId)
    {
        propertyId = ++propertyCount;
        _properties[propertyId] = Property({
            propertyAddress: _address,
            owner: msg.sender,
            price: _price,
            exists: true
        });
        emit PropertyRegistered(propertyId, _address, msg.sender, _price);
    }

    /// @notice Transfer ownership of a property to a new address.
    /// @dev Only the current owner may call this.
    function transferOwnership(uint256 _propertyId, address _newOwner)
        external
        onlyOwner(_propertyId)
    {
        if (_newOwner == address(0)) revert ZeroAddress();
        address from = _properties[_propertyId].owner;
        _properties[_propertyId].owner = _newOwner;
        emit OwnershipTransferred(_propertyId, from, _newOwner);
    }

    /// @notice View a property's details.
    /// @param _propertyId Id of the property to read.
    /// @return propertyAddress Physical address.
    /// @return owner Current owner.
    /// @return price Listed price.
    function getProperty(uint256 _propertyId)
        external
        view
        returns (string memory propertyAddress, address owner, uint256 price)
    {
        Property storage p = _properties[_propertyId];
        if (!p.exists) revert PropertyNotFound();
        return (p.propertyAddress, p.owner, p.price);
    }
}
