import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb'; // Or your preferred database client

// Database connection details
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

const notifyMarketplace = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
     
      const eventData = req.body;

      // Validate eventData here if needed

      // Connect to the database
      await client.connect();
      const database = client.db('your-database-name');
      const eventsCollection = database.collection('events');

      // Insert event data into the database
      await eventsCollection.insertOne(eventData);

      // Notify the marketplace or perform any other actions
      // You might need to integrate with a messaging system or service

      res.status(200).json({ message: 'Event successfully notified to the marketplace.' });
    } catch (error) {
      console.error('Error notifying marketplace:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      // Close the database connection
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default notifyMarketplace;
