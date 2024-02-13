const { AsyncLocalStorage } = require("async_hooks");
require("dotenv").config();
/*
dotenv 是一個可以幫開發者把 .env 檔案中的環境變數丟到 process.env 中，這樣就可以在一個檔案中管理所有的環境變數。 
這樣我就可以把資料庫連線、第三方API token、session secret 等東西都放在 .env 中，在部署的指令前就不需要宣告這些環境變數
*/
module.exports = {
    mongodb: {
                    host:   process.env.HOST,
                    user:   process.env.DATABASE_USER,
                password:   process.env.DATABASE_PASSWORD,
                database:   process.env.DATABASE,
      members_Collection:   process.env.MEMBERS_COLLECTION,
        buddy_Collection:   process.env.BUDDY_COLLECTION
    },
                 JWT_KEY:   process.env.JWT_KEY
}