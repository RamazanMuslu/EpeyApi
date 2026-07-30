"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.images = exports.getInfo = exports.info = exports.search = void 0;
const epey_parser_1 = require("../parser/epey-parser");
const helper_1 = require("../helper");
const search = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "Missing required search query parameter 'q'" });
    }
    try {
        const result = await (0, epey_parser_1.scrapeSearch)((0, helper_1.formatSearch)(query));
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("search controller error:", error);
        return res.sendStatus(500);
    }
};
exports.search = search;
const info = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Missing required parameter 'id'" });
    }
    try {
        const result = await (0, epey_parser_1.scrapeInfo)(id);
        if (!result) {
            return res.status(404).json({ error: "Phone info not found" });
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("info controller error:", error);
        return res.sendStatus(500);
    }
};
exports.info = info;
const getInfo = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: "Missing required search query parameter 'q'" });
    }
    try {
        const id = await (0, epey_parser_1.searchAndGetId)((0, helper_1.formatSearch)(query));
        if (!id) {
            return res.status(404).json({ error: "Product not found for the given search query" });
        }
        const result = await (0, epey_parser_1.scrapeInfo)(id);
        if (!result) {
            return res.status(404).json({ error: "Phone info not found" });
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("getInfo controller error:", error);
        return res.sendStatus(500);
    }
};
exports.getInfo = getInfo;
const images = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "Missing required parameter 'id'" });
    }
    try {
        const result = await (0, epey_parser_1.scrapeImages)(id);
        return res.status(200).json({ id, images: result });
    }
    catch (error) {
        console.error("images controller error:", error);
        return res.sendStatus(500);
    }
};
exports.images = images;
//# sourceMappingURL=epey.js.map