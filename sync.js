const db = require('./src/models');

async function syncDatabase() {
  try {
    await db.sequelize.sync({ force: true });
    console.log("Database & tables created successfully!");
    process.exit();
  } catch (error) {
    console.error("Error syncing databaseeeeeeeeeeeeeee:", error);
    process.exit(1);
  }
}

syncDatabase();
