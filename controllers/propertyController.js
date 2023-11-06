const Property = require("../models/Property");
const User = require("../models/User");
const addProperty = async (req, res) => {
  const {
    name,
    description,
    fixedPrice,
    isBidding,
    biddingStartTime,
    biddingEndTime,
    specifications,
    reviews,
    comments,
    images,
    location,
  } = req.body;

  const addedBy = req.user.userId; // Assuming you have userId in the JWT payload

  try {
    // Create a new property using the Property model
    const property = new Property({
      name,
      description,
      fixedPrice,
      isBidding,
      biddingStartTime,
      biddingEndTime,
      specifications,
      reviews,
      comments,
      images,
      location,
      addedBy,
    });

    // Save the property to the database
    await property.save();

    res.status(201).json({ message: "Property added successfully", property });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProperty = async (req, res) => {
  const propertyId = req.params.propertyId;
  const {
    name,
    description,
    fixedPrice,
    biddingPrice,
    specifications,
    reviews,
    comments,
    images,
    location,
  } = req.body;

  try {
    // Check if the user has permission to update the property (seller)
    if (req.user.role.toLowerCase() === "seller") {
      const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        {
          name,
          description,
          fixedPrice,
          biddingPrice,
          specifications,
          reviews,
          comments,
          images,
          location,
        },
        { new: true }
      );

      if (!updatedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json({ message: "Property updated successfully", updatedProperty });
    } else {
      res.status(403).json({ message: "Only sellers can update properties" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProperty = async (req, res) => {
  const propertyId = req.params.propertyId;

  try {
    // Check if the user has permission to delete the property (seller)
    if (req.user.role.toLowerCase() === "seller") {
      const deletedProperty = await Property.findByIdAndDelete(propertyId);

      if (!deletedProperty) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json({ message: "Property deleted successfully", deletedProperty });
    } else {
      res.status(403).json({ message: "Only sellers can delete properties" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const viewProperties = async (req, res) => {
  try {
    let filters = {};
    const { minPrice, maxPrice, minBedrooms, maxBedrooms, filter } = req.query;

    // Apply filters based on query parameters
    if (minPrice) {
      filters.fixedPrice = { $gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      filters.fixedPrice = {
        ...filters.fixedPrice,
        $lte: parseFloat(maxPrice),
      };
    }
    if (minBedrooms) {
      filters.bedrooms = { $gte: parseInt(minBedrooms) };
    }
    if (maxBedrooms) {
      filters.bedrooms = { ...filters.bedrooms, $lte: parseInt(maxBedrooms) };
    }

    // Apply additional filters based on the "filter" parameter
    if (filter) {
      const propertyFields = filter.split(",");
      propertyFields.forEach((field) => {
        filters[field] = { $exists: true }; // Filter for fields that exist
      });
    }

    const properties = await Property.find(filters);
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const viewProperty = async (req, res) => {
  const propertyId = req.params.propertyId;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({ property });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserProperties = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const properties = await Property.find({ addedBy: userId });
    return res.status(200).json({ properties });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getBiddingProperties = async (req, res) => {
  try {
    const biddingProperties = await Property.find({ isBidding: true });

    res.status(200).json(biddingProperties);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const viewBids = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Check if the property is in bidding mode
    if (!property.isBidding) {
      return res.status(400).json({ message: 'Bidding is not active for this property.' });
    }

    // Extract bids from the property
    const bids = property.bids;

    res.status(200).json({ bids });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const writeReview = async (req, res) => {
  const { propertyId } = req.params;
  const { username, email, picture, reviewText, rating } = req.body; // Username, email, picture, review text, and rating

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Create a new review object
    const newReview = {
      username,
      email,
      picture,
      reviewText,
      rating,
      // You can include more review-related data here
    };

    // Append the new review to the property's reviews array
    property.reviews.push(newReview);

    // Save the updated property with the new review
    await property.save();

    res.status(201).json({ ...newReview, message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addProperty,
  writeReview,
  viewProperties,
  updateProperty,
  deleteProperty,
  viewProperty,
  getUserProperties,
  getBiddingProperties,
  viewBids
};
