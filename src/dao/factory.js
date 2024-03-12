import config from "../config/config.js";

export let UsersDao;
//Only for users service
switch (config.persistence) {
    case "mongoDb":
        UsersDao = (await import("./users.dao.js")).default;
    case "memory":
        UsersDao = (await import("./users.memory.dao.js")).default;
    default:
        UsersDao = (await import("./users.dao.js")).default;
}
