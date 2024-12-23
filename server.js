const express = require('express');
const { MongoClient } = require('mongodb');

const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const uri = "mongodb+srv://s4069921:p19940215!!@dba-cluster.qibfd.mongodb.net/?retryWrites=true&w=majority&appName=DBA-Cluster";
const client = new MongoClient(uri);

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

const db = client.db("sample_airbnb");

connectToDatabase();

// Serve static files
app.use(express.static('public'));

// API endpoint, display only 20 listings as initial data on the homepage
app.get('/api/data', async (req, res, next) => {
  try {
    const data = await db.collection('listingsAndReviews').find().limit(20).toArray();
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch data from MongoDB', error);
    next(error);
  }
});

// API endpoint, search the result by using the user input
app.get('/api/search', async (req, res, next) => {
  try {
    const { market, property_type, bedrooms } = req.query;
    const query = {};
    
    if (market) {
      query["address.market"] = market; 
    }
    
    if (property_type) {
      query.property_type = property_type;
    }
    
    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms);
    }

    console.log('MongoDB query:', query); 

    const data = await db.collection('listingsAndReviews')
      .find(query)
      .toArray();
      
    console.log(`Found ${data.length} results`); 
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch data from MongoDB', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint, add the booking information into the mongodb database
app.post('/api/data', async (req, res, next) => {
  try {
    const { listingID, bookingID, name, email, mobile, checkin, checkout, postal, residential } = req.body;
    const result = await db.collection('listingsAndReviews').updateOne (
      {_id: listingID},
      {
        $push: {
          bookings:{
            bookingID, name, email, mobile, checkin, checkout, postal, residential
          }
        }
      }
    );
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Booking successful' }); 
    } else {
      res.status(404).json({ error: 'Listing not found or booking not added' });
    }
  } catch (error) {
    console.error('Failed to fetch data from MongoDB', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handlers
app.use((req, res, next) => {
  res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

// Start the server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
