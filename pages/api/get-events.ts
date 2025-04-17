// pages/api/get-events.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await client.connect();
    const db = client.db('your-database-name');
    const eventsCollection = db.collection('events');

    const events = await eventsCollection.find({}).toArray();

    // Send the eventId that was passed, not the MongoDB _id
    const normalized = events.map((event) => ({
      ...event,
      id: event.eventId, // Send the custom eventId here
    }));

    res.status(200).json(normalized);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await client.close();
  }
}
