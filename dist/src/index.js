"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const config_1 = require("../config");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).send("Welcome to Epey.com Smartphone Data API 🎉");
});
app.use("/", (0, router_1.default)());
const server = http_1.default.createServer(app);
server.listen(config_1.PORT, () => {
    console.log(`Server running on http://localhost:${config_1.PORT}/`);
});
//# sourceMappingURL=index.js.map