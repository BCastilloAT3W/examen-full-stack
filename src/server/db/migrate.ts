import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config({ path: ".env.local" });

interface DBConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

function loadDBConfig(): DBConfig {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error("Missing database configuration in .env.local");
  }

  return {
    host: DB_HOST,
    port: parseInt(DB_PORT, 10),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  };
}

function findMigrationFile(): string {
  const migrationsDir = path.join(process.cwd(), "drizzle");
  if (!fs.existsSync(migrationsDir)) {
    throw new Error(`Migrations directory not found: ${migrationsDir}`);
  }

  const files = fs.readdirSync(migrationsDir);
  const migrationFiles = files.filter((file) => file.startsWith("000"));

  if (migrationFiles.length === 0) {
    throw new Error('No migration file starting with "000" found in drizzle/ directory.');
  }

  return path.join(migrationsDir, migrationFiles[0]);
}

function processMigrationFile(filePath: string): string {
  let sqlContent = fs.readFileSync(filePath, "utf-8");

  const lines = sqlContent.split("\n").map((line) => {
    const breakpointIndex = line.indexOf("--> statement-breakpoint");
    if (breakpointIndex !== -1) {
      return line.substring(0, breakpointIndex).trim();
    }
    return line;
  });
  sqlContent = lines.join("\n");

  // Rename constraints to t0, t1, etc.
  // Use a regex to find all CONSTRAINT `constraint_name` and replace with t0, t1, etc.
  const constraintRegex = /ADD CONSTRAINT\s+`[^`]+`/g;
  const matches = sqlContent.match(constraintRegex);

  const uniqueConstraints = matches ? Array.from(new Set(matches)) : [];
  const constraintMap: Record<string, string> = {};

  uniqueConstraints.forEach((constraint, index) => {
    constraintMap[constraint] = `ADD CONSTRAINT \`t${index}\``;
  });

  // Replace all occurrences
  Object.keys(constraintMap).forEach((original) => {
    const replacement = constraintMap[original];
    const regex = new RegExp(original, "g");
    sqlContent = sqlContent.replace(regex, replacement);
  });

  return sqlContent;
}

// Function to split SQL statements by semicolon, considering possible semicolons within statements
function splitSQLStatements(sql: string): string[] {
  const statements: string[] = [];
  let currentStatement = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1];

    if (inString) {
      if (char === stringChar) {
        inString = false;
      } else if (char === "\\" && nextChar === stringChar) {
        currentStatement += char + nextChar;
        i++; // Skip next character
        continue;
      }
    } else {
      if (char === "'" || char === '"') {
        inString = true;
        stringChar = char;
      }
    }

    if (char === ";" && !inString) {
      if (currentStatement.trim()) {
        statements.push(currentStatement.trim());
      }
      currentStatement = "";
    } else {
      currentStatement += char;
    }
  }

  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }

  return statements;
}

// Main migration function
async function runMigration() {
  try {
    const dbConfig = loadDBConfig();
    const migrationFile = findMigrationFile();
    console.log(`Found migration file: ${migrationFile}`);

    const processedSQL = processMigrationFile(migrationFile);
    const sqlStatements = splitSQLStatements(processedSQL);
    console.log(`Total SQL statements to execute: ${sqlStatements.length}`);

    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      multipleStatements: false, // Execute statements one by one
    });

    console.log("Connected to the database.");

    try {
      await connection.beginTransaction();
      console.log("Started transaction.");

      for (let i = 0; i < sqlStatements.length; i++) {
        const statement = sqlStatements[i];
        console.log(`Executing statement ${i + 1}/${sqlStatements.length}:`);
        console.log(statement);
        await connection.execute(statement);
      }

      await connection.commit();
      console.log("Migration completed successfully and transaction committed.");
    } catch (err) {
      await connection.rollback();
      console.error("Error during migration. Transaction rolled back.", err);
      process.exit(1);
    } finally {
      await connection.end();
      console.log("Database connection closed.");
    }
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration()
  .then(() => {
    console.log("Migration completed successfully.");
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
