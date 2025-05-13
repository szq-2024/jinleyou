"use strict";
const utils_request = require("./request.js");
const fetchScenicData = (id) => {
  return utils_request.request({
    url: `/scenic/${id}`,
    method: "GET"
  });
};
exports.fetchScenicData = fetchScenicData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/scenic.js.map
