"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const epey_1 = require("../controllers/epey");
exports.default = (router) => {
    router.get("/epey/search", epey_1.search);
    router.get("/epey/searchInfo", epey_1.getInfo);
    router.get("/epey/info/:id", epey_1.info);
    router.get("/epey/images/:id", epey_1.images);
};
//# sourceMappingURL=epey.js.map