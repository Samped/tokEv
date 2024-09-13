import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/dbConnect';
import { MongoClient } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      console.log('Connecting to the database...');
      const client: MongoClient = await clientPromise;
      const db = client.db('tokev');
      const collection = db.collection('events');
      const event = req.body;

      // Log received data
      console.log('Received event data:', event);

      // Optional: Convert types if needed
      const cost = parseFloat(event.cost); // Convert cost to a number
      const numOfTickets = parseInt(event.numOfTickets, 10); // Convert numOfTickets to a number

      // Prepare data for insertion
      const eventData = {
        ...event,
        cost,
        numOfTickets,
      };

      // Insert the event into the MongoDB collection
      const result = await collection.insertOne(eventData);
      console.log('Event inserted:', result);

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error inserting event:', error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      } else {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Internal Server Error', error: 'An unexpected error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
