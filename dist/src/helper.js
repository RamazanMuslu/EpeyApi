"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSearch = formatSearch;
exports.formatId = formatId;
function formatSearch(searchValue) {
    if (!searchValue)
        return "";
    return encodeURIComponent(searchValue.trim()).replace(/%20/g, "+");
}
function formatId(id) {
    if (!id)
        return "";
    let cleanId = id.trim();
    if (cleanId.startsWith("/")) {
        cleanId = cleanId.substring(1);
    }
    // If it's a path like akilli-telefonlar/apple-iphone-16-pro-1tb.html
    if (cleanId.includes("/")) {
        const parts = cleanId.split("/");
        cleanId = parts[parts.length - 1];
    }
    return cleanId;
}
//# sourceMappingURL=helper.js.map