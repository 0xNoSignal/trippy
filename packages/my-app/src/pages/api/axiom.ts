import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  success: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Extract 'hash' from query parameters
  const { hash } = req.query;

  // Ensure 'hash' is a string
  const hashString = Array.isArray(hash) ? hash[0] : hash;

  // Use the function with 'hash' string
  const result = hashString ? hashString : "WRONG";
  const success = hashString ? true : false;

  // Send back the processed string
  res.status(200).json({ message: result, success });
}
