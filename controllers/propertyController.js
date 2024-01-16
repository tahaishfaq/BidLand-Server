const Property = require("../models/Property");
const User = require("../models/User");
const stripe = require('stripe')('sk_test_51NO5Z9COYbX4EEUkbG0REHY3UBcqDZZj7zMyETaQbhrvqjtv3Rqj8UQxB5rO5teHzhB4wF4pibfpZL7pMb0RfOyw00MN9vowJH');
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
    propertyType, 
    city, 
  } = req.body;

  const addedBy = req.user.userId; 

  try {
    
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
      propertyType,
      city,
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
    propertyType,
    city,
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
          propertyType,
          city,
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
    if (req.user.role.toLowerCase() === "seller" || req.user.role.toLowerCase() === "admin") {
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
    res.status(500).json({ message: "Internal server error" });
  }
};

const viewBids = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    // Check if the property is in bidding mode
    if (!property.isBidding) {
      return res
        .status(400)
        .json({ message: "Bidding is not active for this property." });
    }

    // Extract bids from the property
    const bids = property.bids;

    res.status(200).json({ bids });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const writeReview = async (req, res) => {
  const { propertyId } = req.params;
  const { username, email, profilePicture, reviewText, rating } = req.body;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: "Property not found." });
    }

    // Check if the user has already submitted a review for this property
    const existingReview = property.reviews.find(
      (review) => review.email === email
    );

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already submitted a review for this property." });
    }

    // Create a new review object
    const newReview = {
      username,
      email,
      profilePicture,
      reviewText,
      rating,
    };

    // Append the new review to the property's reviews array
    property.reviews.push(newReview);

    await property.save();

    res
      .status(201)
      .json({ ...newReview, message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


const filterByPropertyType = async (req, res) => {
  try {
    const { propertyType } = req.query;

    if (!propertyType) {
      return res.status(400).json({ message: 'Property type is required.' });
    }

    const filteredProperties = await Property.find({ propertyType: propertyType });

    res.status(200).json(filteredProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const filterByPropertyCity = async (req, res) => {
  try {
    const { city} = req.query;

    if (!city) {
      return res.status(400).json({ message: 'Property type is required.' });
    }

    const filteredProperties = await Property.find({ city: city });

    res.status(200).json(filteredProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const filterByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;

    if (!minPrice || !maxPrice) {
      return res.status(400).json({ message: 'Both minPrice and maxPrice are required.' });
    }

    const filteredProperties = await Property.find({
      fixedPrice: { $gt: minPrice, $lt: maxPrice },
    });

    res.status(200).json(filteredProperties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addReport = async (req, res) => {
  const { propertyId } = req.params;
  const { feedbackMessage, feedbackReason } = req.body;
  const userId = req.user.userId; 

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Check if the user has already reported this property
    const existingReport = property.reports.find(report => report.user.equals(userId));

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this property.' });
    }

    // Create a new report object
    const newReport = {
      user: userId,
      feedbackMessage,
      feedbackReason,
    };

    // Append the new report to the property's reports array
    property.reports.push(newReport);

    // Save the updated property with the new report
    await property.save();

    res.status(201).json({ message: 'Report added successfully', report: newReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createCheckoutSession = async (req, res) => {
  const { propertyId, name, fixedPrice } = req.body;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // You can customize the line items based on your requirements
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', // Replace with your desired currency
            product_data: {
              name: name, // Property name
            },
            unit_amount: fixedPrice / 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/success', // Replace with your success URL
      cancel_url: 'http://localhost:5173/cancel', // Replace with your cancel URL
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const fetchPayments = async (req, res) => {
  try {
    // Fetch payments using the Stripe API
    const payments = await stripe.paymentIntents.list();

    // Respond with the list of payments
    res.status(200).json({ payments: payments.data });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const winBid = async (req, res) => {
  const { propertyId, bidId, winnerUserId } = req.body;

  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Check if a winner is already declared for the property
    if (property.isBiddingWinnerDeclared) {
      return res.status(400).json({ message: 'Winner already declared for this property.' });
    }

    const bid = property.bids.id(bidId);

      if (!bid) {
        return res.status(404).json({ message: 'Bid not found.' });
      }

      // Update the bid with win information
      bid.winInfo = {
        winnerUserId,
        timestamp: new Date(),
      };

    // Update the winner and winning price
    property.winner = winnerUserId;
    property.isBiddingWinnerDeclared = true;
    property.isBidding = false;
    property.biddingStartTime = null;
    property.biddingEndTime = null;

    await property.save();

    // Optionally, you can update the bid status or perform other actions

    res.status(200).json({ message: 'Winner declared successfully.', property });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const getPropertyQueries = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Check if the logged-in user is the seller of the property
    // if (property.addedBy.toString() !== req.user.userId) {
    //   return res.status(403).json({ message: 'You are not authorized to view queries for this property.' });
    // }

    // Retrieve and send property queries to the seller
    const queries = property.queries || [];
    res.json({ queries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addPropertyQuery = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { userDetails, queryText } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Add the new query to the property
    const newQuery = {
      userId: req.user.userId,
      userDetails,
      queryText,
      timestamp: new Date(),
    };

    property.queries = property.queries || [];
    property.queries.push(newQuery);

    await property.save();

    res.status(201).json({ message: 'Query added successfully', query: newQuery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const replyToQuery = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { propertyId, replyText } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found.' });
    }

    // Check if the logged-in user is the seller of the property
    

    // Find the query to which the seller is replying
    const query = property.queries.find(q => q._id.toString() === queryId);
    if (!query) {
      return res.status(404).json({ message: 'Query not found.' });
    }

    // Add the reply to the query
    query.replyText = replyText;
    query.replyTimestamp = new Date();

    await property.save();

    res.json({ message: 'Reply added successfully', query });
  } catch (error) {
    console.error(error);
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
  viewBids,
  filterByPropertyType,
  filterByPropertyCity,
  filterByPriceRange,
  addReport,
  createCheckoutSession,
  fetchPayments,
  winBid,
  getPropertyQueries,
  addPropertyQuery,
  replyToQuery,
};
