import { type InferSelectModel, type InferInsertModel, sql } from "drizzle-orm";
import {
  mysqlTable,
  int,
  varchar,
  text,
  float,
  unique,
  mysqlEnum,
  date,
  datetime,
  boolean,
} from "drizzle-orm/mysql-core";

export const companyType = [
  "Assets",
  "Government",
  "Individual Investor",
  "Institution",
  "Private",
  "Public",
  "Trial Sites",
] as const;
export type CompanyType = (typeof companyType)[number];

export const company = mysqlTable("Company", {
  companyId: int("company_id").primaryKey().autoincrement().notNull(),
  updatedAt: datetime("updated_at", { mode: "string" })
    .default(sql`current_timestamp`)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }),
  city: varchar("city", { length: 50 }),
  country: varchar("country", { length: 50 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  url: varchar("company_url", { length: 180 }),
  hierarchy: varchar("hierarchy", { length: 180 }),
  companyType: mysqlEnum("company_type", companyType),
  freeText: text("free_text"),
});
export type InsertCompany = InferInsertModel<typeof company>;
export type SelectCompany = InferSelectModel<typeof company>;

export const constructionType = [
  "New",
  "Renovation",
  "Expansion",
  "Redevelopment",
  "Upgrade",
] as const;
export type ConstructionType = (typeof constructionType)[number];

export const construction = mysqlTable("Construction", {
  constructionId: int("construction_id").primaryKey().autoincrement().notNull(),
  updatedAt: datetime("updated_at", { mode: "string" })
    .default(sql`current_timestamp`)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  powerCapacity: float("power_capacity"),
  city: varchar("city", { length: 255 }),
  country: varchar("country", { length: 255 }),
  sector: varchar("sector", { length: 255 }),
  type: mysqlEnum("construction_type", constructionType),
  constructionStage: varchar("construction_stage", { length: 255 }),
  constructionValue: float("construction_value"),
  freeText: text("free_text"),
});
export type InsertConstruction = InferInsertModel<typeof construction>;
export type SelectConstruction = InferSelectModel<typeof construction>;

export const companyRoles = [
  "Project Owner",
  "Main Contractor",
  "Feed Design",
  "Consultant",
  "Project Owner, Main Contractor",
  "Project Owner, Feed Design",
  "Project Owner, Consultant",
  "Main Contractor, Feed Design",
  "Main Contractor, Consultant",
  "Feed Design, Consultant",
  "Project Owner, Main Contractor, Feed Design",
  "Project Owner, Main Contractor, Consultant",
  "Project Owner, Feed Design, Consultant",
  "Main Contractor, Feed Design, Consultant",
  "Project Owner, Main Contractor, Feed Design, Consultant",
] as const;
export type CompanyRole = (typeof companyRoles)[number];
export const constructionCompanyRole = mysqlTable(
  "ConstructionCompanyRole",
  {
    roleId: int("role_id").primaryKey().autoincrement().notNull(),
    constructionId: int("construction_id")
      .notNull()
      .references(() => construction.constructionId),
    companyId: int("company_id")
      .notNull()
      .references(() => company.companyId),
    role: mysqlEnum("role", companyRoles).notNull(),
  },
  (table) => {
    return {
      uniqueConstructionCompany: unique("unique_construction_company").on(
        table.constructionId,
        table.companyId,
      ),
    };
  },
);
export type InsertConstructionCompanyRole = InferInsertModel<typeof constructionCompanyRole>;
export type SelectConstructionCompanyRole = InferSelectModel<typeof constructionCompanyRole>;

export const contact = mysqlTable("Contact", {
  contactId: int("contact_id").primaryKey().autoincrement().notNull(),
  updatedAt: datetime("updated_at", { mode: "string" })
    .default(sql`current_timestamp`)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 50 }),
  email: varchar("email", { length: 100 }),
  freeText: text("free_text"),
});
export type InsertContact = InferInsertModel<typeof contact>;
export type SelectContact = InferSelectModel<typeof contact>;

export const contactCompany = mysqlTable(
  "ContactCompany",
  {
    contactCompanyId: int("contact_company_id").primaryKey().autoincrement().notNull(),
    contactId: int("contact_id")
      .notNull()
      .references(() => contact.contactId),
    companyId: int("company_id")
      .notNull()
      .references(() => company.companyId),
    position: varchar("position", { length: 255 }),
  },
  (table) => {
    return {
      uniqueContactCompany: unique("unique_contact_company").on(table.contactId, table.companyId),
    };
  },
);
export type SelectContactCompany = InferSelectModel<typeof contactCompany>;

export const contactConstruction = mysqlTable(
  "ContactConstruction",
  {
    contactConstructionId: int("contact_construction_id").primaryKey().autoincrement().notNull(),
    contactId: int("contact_id")
      .notNull()
      .references(() => contact.contactId),
    constructionId: int("construction_id")
      .notNull()
      .references(() => construction.constructionId),
  },
  (table) => {
    return {
      uniqueContactConstruction: unique("unique_contact_construction").on(
        table.contactId,
        table.constructionId,
      ),
    };
  },
);

export type SelectContactConstruction = InferSelectModel<typeof contactConstruction>;

export const contactProject = mysqlTable(
  "ContactProject",
  {
    contactProjectId: int("contact_project_id").primaryKey().autoincrement().notNull(),
    contactId: int("contact_id")
      .notNull()
      .references(() => contact.contactId),
    projectId: int("project_id")
      .notNull()
      .references(() => project.projectId),
  },
  (table) => {
    return {
      uniqueContactProject: unique("unique_contact_project").on(table.contactId, table.projectId),
    };
  },
);

export type SelectcContactProject = InferSelectModel<typeof contactProject>;

export const file = mysqlTable("File", {
  fileId: int("file_id").primaryKey().autoincrement().notNull(),
  entityType: mysqlEnum("entity_type", ["Company", "Construction", "Project", "Contact"]).notNull(),
  entityId: int("entity_id").notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 500 }).notNull(),
});

export const milestones = [
  "None",
  "Milestone: PIR recibido",
  "Milestone: PIR revision",
  "Milestone: PIR terminado",
  "Milestone: Propuesta de proyecto",
  "Milestone: Orden de compra",
] as const;
export type MilestoneType = (typeof milestones)[number];

export const commonFollowUps = [
  "Call",
  "Email",
  "VideoCall",
  "ExternalVisit",
  "InternalVisit",
  "Edit",
  "Note",
  "Archived",
  "Unarchived",
] as const;
export type CommonFollowUpType = (typeof commonFollowUps)[number];

export const companyFollowUp = mysqlTable("CompanyFollowUp", {
  followUpId: int("follow_up_id").primaryKey().autoincrement().notNull(),
  companyId: int("company_id")
    .notNull()
    .references(() => company.companyId),
  authorId: int("author_id")
    .notNull()
    .references(() => staff.staffId),
  contactId: int("contact_id").references(() => contact.contactId),
  type: mysqlEnum("type", commonFollowUps).notNull(),
  body: text("body").notNull(),
  // you can use { mode: 'date' }, if you want to have Date as type for this column
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  // you can use { mode: 'date' }, if you want to have Date as type for this column
  nextFollowUpDate: date("next_follow_up_date", { mode: "string" }),
  nextFollowUpNote: varchar("next_follow_up_note", { length: 255 }),
});
export type InsertCompanyFollowUp = InferInsertModel<typeof companyFollowUp>;
export type SelectCompanyFollowUp = InferSelectModel<typeof companyFollowUp>;

export const constructionFollowUp = mysqlTable("ConstructionFollowUp", {
  followUpId: int("follow_up_id").primaryKey().autoincrement().notNull(),
  constructionId: int("construction_id")
    .notNull()
    .references(() => construction.constructionId),
  authorId: int("author_id")
    .notNull()
    .references(() => staff.staffId),
  contactId: int("contact_id").references(() => contact.contactId),
  companyId: int("company_id").references(() => company.companyId),
  type: mysqlEnum("type", commonFollowUps).notNull(),
  // you can use { mode: 'date' }, if you want to have Date as type for this column
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  body: text("body").notNull(),
  // you can use { mode: 'date' }, if you want to have Date as type for this column
  nextFollowUpDate: date("next_follow_up_date", { mode: "string" }),
  nextFollowUpNote: varchar("next_follow_up_note", { length: 255 }),
});
export type InsertConstructionFollowUp = InferInsertModel<typeof constructionFollowUp>;
export type SelectConstructionFollowUp = InferSelectModel<typeof constructionFollowUp>;

export const projectFollowUp = mysqlTable("ProjectFollowUp", {
  followUpId: int("follow_up_id").primaryKey().autoincrement().notNull(),
  projectId: int("project_id")
    .notNull()
    .references(() => project.projectId),
  authorId: int("author_id")
    .notNull()
    .references(() => staff.staffId),
  contactId: int("contact_id").references(() => contact.contactId),
  companyId: int("company_id").references(() => company.companyId),
  type: mysqlEnum("type", [...commonFollowUps, ...milestones]).notNull(),
  // you can use { mode: 'date' }, if you want to have Date as type for this column
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  body: text("body").notNull(),
  // you can use { mode: 'date' }, if you want to have Date as type for this column
  nextFollowUpDate: date("next_follow_up_date", { mode: "string" }),
  nextFollowUpNote: varchar("next_follow_up_note", { length: 255 }),
});
export type InsertProjectFollowUp = InferInsertModel<typeof projectFollowUp>;
export type SelectProjectFollowUp = InferSelectModel<typeof projectFollowUp>;

export const staff = mysqlTable("Staff", {
  staffId: int("staff_id").primaryKey().autoincrement().notNull(),
  login: varchar("login", { length: 12 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
});
export type InsertStaff = InferInsertModel<typeof staff>;
export type SelectStaff = InferSelectModel<typeof staff>;

export const staffCompanyAssignment = mysqlTable(
  "StaffCompanyAssignment",
  {
    assignmentId: int("assignment_id").primaryKey().autoincrement().notNull(),
    staffId: int("staff_id")
      .notNull()
      .references(() => staff.staffId),
    companyId: int("company_id")
      .notNull()
      .references(() => company.companyId),
    isArchived: boolean("is_archived").default(false).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    nextFollowUpDate: date("next_follow_up_date", { mode: "string" }),
    nextFollowUpNote: text("follow_up_note"),
  },
  (table) => {
    return {
      uniqueStaffCompany: unique("unique_staff_company").on(table.staffId, table.companyId),
    };
  },
);
export type SelectStaffCompanyAssignment = InferSelectModel<typeof staffCompanyAssignment>;

export const staffConstructionAssignment = mysqlTable(
  "StaffConstructionAssignment",
  {
    assignmentId: int("assignment_id").primaryKey().autoincrement().notNull(),
    staffId: int("staff_id")
      .notNull()
      .references(() => staff.staffId),
    constructionId: int("construction_id")
      .notNull()
      .references(() => construction.constructionId),
    isArchived: boolean("is_archived").default(false).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    nextFollowUpDate: date("next_follow_up_date", { mode: "string" }),
    nextFollowUpNote: text("follow_up_note"),
  },
  (table) => {
    return {
      uniqueStaffConstruction: unique("unique_staff_construction").on(
        table.staffId,
        table.constructionId,
      ),
    };
  },
);
export type SelectStaffConstructionAssignment = InferSelectModel<
  typeof staffConstructionAssignment
>;

export const staffProjectAssignment = mysqlTable(
  "StaffProjectAssignment",
  {
    assignmentId: int("assignment_id").primaryKey().autoincrement().notNull(),
    staffId: int("staff_id")
      .notNull()
      .references(() => staff.staffId),
    projectId: int("project_id")
      .notNull()
      .references(() => project.projectId),
    isArchived: boolean("is_archived").default(false).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    nextFollowUpDate: date("next_follow_up_date", { mode: "string" }),
    nextFollowUpNote: text("follow_up_note"),
  },
  (table) => {
    return {
      uniqueStaffProject: unique("unique_staff_project").on(table.staffId, table.projectId),
    };
  },
);
export type SelectStaffProjectAssignment = InferSelectModel<typeof staffProjectAssignment>;

export const project = mysqlTable("Project", {
  projectId: int("project_id").primaryKey().autoincrement().notNull(),
  updatedAt: datetime("updated_at", { mode: "string" })
    .default(sql`current_timestamp`)
    .notNull(),
  authorId: int("author_id").references(() => staff.staffId),
  constructionId: int("construction_id")
    .notNull()
    .references(() => construction.constructionId),
  companyId: int("company_id")
    .notNull()
    .references(() => company.companyId),
  name: varchar("name", { length: 255 }).notNull(),
  milestone: mysqlEnum("milestone", milestones).notNull(),
  saleProbability: float("sale_probability").notNull(),
  freeText: text("free_text"),
});
export type InsertProject = InferInsertModel<typeof project>;
export type SelectProject = InferSelectModel<typeof project>;

export const productNames = [
  "Estudios Geolectricos",
  "Proyectos de puesta a tierra",
  "Proyectos de protección contra el rayo",
  "Servicios avanzados datatech",
  "SEMS",
  "AT STORM",
  "DAT CONTROLLER REMOTE",
  "SMART LIGHTING LOGGER",
  "APLIWELD SECURE",
] as const;
export type Product = (typeof productNames)[number];

export const projectProduct = mysqlTable(
  "ProjectProduct",
  {
    projectProductId: int("project_product_id").primaryKey().autoincrement().notNull(),
    projectId: int("project_id")
      .notNull()
      .references(() => project.projectId),
    productName: mysqlEnum("product_name", productNames).notNull(),
  },
  (table) => {
    return {
      uniqueProjectProduct: unique("unique_project_product").on(table.projectId, table.productName),
    };
  },
);
export type SelectProjectProduct = InferSelectModel<typeof projectProduct>;

/* Below are the edit tables
 * These tables are used to store the edits made to the main tables
 * The last edit applied to an entity is the current state of the entity
 * The past ones are just stored for auditing purposes */

export const constructionEdits = mysqlTable("ConstructionEdits", {
  editId: int("edit_id").primaryKey().autoincrement().notNull(),
  constructionId: int("construction_id")
    .notNull()
    .references(() => construction.constructionId),
  authorId: int("author_id")
    .notNull()
    .references(() => staff.staffId),
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  /* Editable fields */
  name: varchar("name", { length: 255 }),
  powerCapacity: float("power_capacity"),
  city: varchar("city", { length: 255 }),
  country: varchar("country", { length: 255 }),
  sector: varchar("sector", { length: 255 }),
  type: mysqlEnum("construction_type", constructionType),
  constructionValue: float("construction_value"),
  freeText: text("free_text"),
});
export type InsertConstructionEdits = InferInsertModel<typeof constructionEdits>;
export type SelectConstructionEdits = InferSelectModel<typeof constructionEdits>;
export type ConstructionEditableField = keyof Omit<
  SelectConstructionEdits,
  "editId" | "constructionId" | "authorId" | "createdAt"
>;

export const companyEdits = mysqlTable("CompanyEdits", {
  editId: int("edit_id").primaryKey().autoincrement().notNull(),
  companyId: int("company_id")
    .notNull()
    .references(() => company.companyId),
  authorId: int("author_id")
    .notNull()
    .references(() => staff.staffId),
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  /* Editable fields */
  name: varchar("name", { length: 255 }),
  city: varchar("city", { length: 255 }),
  country: varchar("country", { length: 255 }),
  freeText: text("free_text"),
});
export type InsertCompanyEdits = InferInsertModel<typeof companyEdits>;
export type SelectCompanyEdits = InferSelectModel<typeof companyEdits>;
export type CompanyEditableField = keyof Omit<
  SelectCompanyEdits,
  "editId" | "companyId" | "authorId" | "createdAt"
>;

export const projectEdits = mysqlTable("ProjectEdits", {
  editId: int("edit_id").primaryKey().autoincrement().notNull(),
  projectId: int("project_id")
    .notNull()
    .references(() => project.projectId),
  authorId: int("author_id")
    .notNull()
    .references(() => staff.staffId),
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  /* Editable fields */
  name: varchar("name", { length: 255 }),
  milestone: mysqlEnum("milestone", milestones),
  saleProbability: float("sale_probability"),
  freeText: text("free_text"),
});
export type InsertProjectEdits = InferInsertModel<typeof projectEdits>;
export type SelectProjectEdits = InferSelectModel<typeof projectEdits>;
export type ProjectEditableField = keyof Omit<
  SelectProjectEdits,
  "editId" | "projectId" | "authorId" | "createdAt"
>;

export const contactEdits = mysqlTable("ContactEdits", {
  editId: int("edit_id").primaryKey().autoincrement().notNull(),
  contactId: int("contact_id")
    .notNull()
    .references(() => contact.contactId),
  authorId: int("author_id")
    .notNull()
    .references(() => staff.staffId),
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  name: varchar("name", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 50 }),
  email: varchar("email", { length: 100 }),
  freeText: text("free_text"),
});
export type InsertContactEdits = InferInsertModel<typeof contactEdits>;
export type SelectContactEdits = InferSelectModel<typeof contactEdits>;
export type ContactEditableField = keyof Omit<
  SelectContactEdits,
  "editId" | "contactId" | "authorId" | "createdAt"
>;

/* Notification tables */

export const foreignFollowUpConstructionNotification = mysqlTable(
  "ForeignFollowUpConstructionNotification",
  {
    notificationId: int("notification_id").primaryKey().autoincrement().notNull(),
    authorId: int("author_id")
      .notNull()
      .references(() => staff.staffId),
    deliveredToId: int("delivered_to_id")
      .notNull()
      .references(() => staff.staffId),
    followUpId: int("follow_up_id")
      .notNull()
      .references(() => constructionFollowUp.followUpId),
    createdAt: datetime("created_at", { mode: "string" }).notNull(),
    seen: datetime("seen", { mode: "string" }),
  },
  (table) => {
    return {
      uniqueFollowUpDeliveredTo: unique("unique_follow_up_delivered_to").on(
        table.followUpId,
        table.deliveredToId,
      ),
    };
  },
);
export type SelectForeignFollowUpConstructionNotification = InferSelectModel<
  typeof foreignFollowUpConstructionNotification
>;

export const foreignFollowUpCompanyNotification = mysqlTable("ForeignFollowUpCompanyNotification", {
  notificationId: int("notification_id").primaryKey().autoincrement().notNull(),
  authorId: int("author_id")
    .notNull()
    .references(() => staff.staffId),
  deliveredToId: int("delivered_to_id")
    .notNull()
    .references(() => staff.staffId),
  followUpId: int("follow_up_id")
    .notNull()
    .references(() => companyFollowUp.followUpId),
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  seen: datetime("seen", { mode: "string" }),
});

export const foreignFollowUpProjectNotification = mysqlTable("ForeignFollowUpProjectNotification", {
  notificationId: int("notification_id").primaryKey().autoincrement().notNull(),
  authorId: int("author_id")
    .notNull()
    .references(() => staff.staffId),
  deliveredToId: int("delivered_to_id")
    .notNull()
    .references(() => staff.staffId),
  followUpId: int("follow_up_id")
    .notNull()
    .references(() => projectFollowUp.followUpId),
  createdAt: datetime("created_at", { mode: "string" }).notNull(),
  seen: datetime("seen", { mode: "string" }),
});
