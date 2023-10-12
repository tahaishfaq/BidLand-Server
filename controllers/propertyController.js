const Property = require('../models/Property');

const addProperty = async (req, res) => {
  const { name, description, fixedPrice, biddingPrice, specifications, reviews, comments, images, location } = req.body;
  const addedBy = req.user.userId; // Assuming you have userId in the JWT payload

  try {
    const property = new Property({
      name,
      description,
      fixedPrice,
      biddingPrice,
      specifications,
      reviews,
      comments,
      images,
      location,
      addedBy
    });

    await property.save();
    res.status(201).json({ message: 'Property added successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProperty = async (req, res) => {
  const propertyId = req.params.propertyId;
  const { name, description, fixedPrice, biddingPrice, specifications, reviews, comments, images, location } = req.body;

  try {
    // Check if the user has permission to update the property (seller)
    if (req.user.role.toLowerCase() === 'seller') {
      const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        { name, description, fixedPrice, biddingPrice, specifications, reviews, comments, images, location },
        { new: true }
      );

      if (!updatedProperty) {
        return res.status(404).json({ message: 'Property not found' });
      }

      res.json({ message: 'Property updated successfully', updatedProperty });
    } else {
      res.status(403).json({ message: 'Only sellers can update properties' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteProperty = async (req, res) => {
  const propertyId = req.params.propertyId;

  try {
    // Check if the user has permission to delete the property (seller)
    if (req.user.role.toLowerCase() === 'seller') {
      const deletedProperty = await Property.findByIdAndDelete(propertyId);

      if (!deletedProperty) {
        return res.status(404).json({ message: 'Property not found' });
      }

      res.json({ message: 'Property deleted successfully', deletedProperty });
    } else {
      res.status(403).json({ message: 'Only sellers can delete properties' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
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
      filters.fixedPrice = { ...filters.fixedPrice, $lte: parseFloat(maxPrice) };
    }
    if (minBedrooms) {
      filters.bedrooms = { $gte: parseInt(minBedrooms) };
    }
    if (maxBedrooms) {
      filters.bedrooms = { ...filters.bedrooms, $lte: parseInt(maxBedrooms) };
    }

    // Apply additional filters based on the "filter" parameter
    if (filter) {
      const propertyFields = filter.split(',');
      propertyFields.forEach(field => {
        filters[field] = { $exists: true }; // Filter for fields that exist
      });
    }

    const properties = await Property.find(filters);
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const viewProperty = async (req, res) => {
  const propertyId = req.params.propertyId;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ property });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addProperty, viewProperties, updateProperty, deleteProperty, viewProperty };


