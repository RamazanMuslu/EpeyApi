import express from "express";
import { scrapeSearch, scrapeInfo, scrapeImages, searchAndGetId } from "../parser/epey-parser";
import { formatSearch } from "../helper";

export const search = async (req: express.Request, res: express.Response) => {
  const query = req.query.q as string;
  if (!query) {
    return res.status(400).json({ error: "Missing required search query parameter 'q'" });
  }

  try {
    const result = await scrapeSearch(formatSearch(query));
    return res.status(200).json(result);
  } catch (error) {
    console.error("search controller error:", error);
    return res.sendStatus(500);
  }
};

export const info = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Missing required parameter 'id'" });
  }

  try {
    const result = await scrapeInfo(id as string);
    if (!result) {
      return res.status(404).json({ error: "Phone info not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("info controller error:", error);
    return res.sendStatus(500);
  }
};

export const getInfo = async (req: express.Request, res: express.Response) => {
  const query = req.query.q as string;
  if (!query) {
    return res.status(400).json({ error: "Missing required search query parameter 'q'" });
  }

  try {
    const id = await searchAndGetId(formatSearch(query));
    if (!id) {
      return res.status(404).json({ error: "Product not found for the given search query" });
    }

    const result = await scrapeInfo(id);
    if (!result) {
      return res.status(404).json({ error: "Phone info not found" });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("getInfo controller error:", error);
    return res.sendStatus(500);
  }
};

export const images = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Missing required parameter 'id'" });
  }

  try {
    const result = await scrapeImages(id as string);
    return res.status(200).json({ id, images: result });
  } catch (error) {
    console.error("images controller error:", error);
    return res.sendStatus(500);
  }
};
