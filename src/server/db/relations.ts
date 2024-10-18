import { relations } from "drizzle-orm/relations";
import {
  company,
  companyEdits,
  staff,
  companyFollowUp,
  contact,
  construction,
  constructionCompanyRole,
  constructionEdits,
  constructionFollowUp,
  contactCompany,
  contactConstruction,
  contactEdits,
  contactProject,
  project,
  foreignFollowUpCompanyNotification,
  foreignFollowUpConstructionNotification,
  foreignFollowUpProjectNotification,
  projectFollowUp,
  projectEdits,
  projectProduct,
  staffCompanyAssignment,
  staffConstructionAssignment,
  staffProjectAssignment,
} from "./schema";

export const companyEditsRelations = relations(companyEdits, ({ one }) => ({
  company: one(company, {
    fields: [companyEdits.companyId],
    references: [company.companyId],
  }),
  staff: one(staff, {
    fields: [companyEdits.authorId],
    references: [staff.staffId],
  }),
}));

export const companyRelations = relations(company, ({ many }) => ({
  companyEdits: many(companyEdits),
  companyFollowUps: many(companyFollowUp),
  constructionCompanyRoles: many(constructionCompanyRole),
  constructionFollowUps: many(constructionFollowUp),
  contactCompanies: many(contactCompany),
  projects: many(project),
  projectFollowUps: many(projectFollowUp),
  staffCompanyAssignments: many(staffCompanyAssignment),
}));

export const staffRelations = relations(staff, ({ many }) => ({
  companyEdits: many(companyEdits),
  companyFollowUps: many(companyFollowUp),
  constructionEdits: many(constructionEdits),
  constructionFollowUps: many(constructionFollowUp),
  contactEdits: many(contactEdits),
  foreignFollowUpCompanyNotifications_authorId: many(foreignFollowUpCompanyNotification, {
    relationName: "foreignFollowUpCompanyNotification_authorId_staff_staffId",
  }),
  foreignFollowUpCompanyNotifications_deliveredToId: many(foreignFollowUpCompanyNotification, {
    relationName: "foreignFollowUpCompanyNotification_deliveredToId_staff_staffId",
  }),
  foreignFollowUpConstructionNotifications_authorId: many(foreignFollowUpConstructionNotification, {
    relationName: "foreignFollowUpConstructionNotification_authorId_staff_staffId",
  }),
  foreignFollowUpConstructionNotifications_deliveredToId: many(
    foreignFollowUpConstructionNotification,
    {
      relationName: "foreignFollowUpConstructionNotification_deliveredToId_staff_staffId",
    },
  ),
  foreignFollowUpProjectNotifications_authorId: many(foreignFollowUpProjectNotification, {
    relationName: "foreignFollowUpProjectNotification_authorId_staff_staffId",
  }),
  foreignFollowUpProjectNotifications_deliveredToId: many(foreignFollowUpProjectNotification, {
    relationName: "foreignFollowUpProjectNotification_deliveredToId_staff_staffId",
  }),
  projects: many(project),
  projectEdits: many(projectEdits),
  projectFollowUps: many(projectFollowUp),
  staffCompanyAssignments: many(staffCompanyAssignment),
  staffConstructionAssignments: many(staffConstructionAssignment),
  staffProjectAssignments: many(staffProjectAssignment),
}));

export const companyFollowUpRelations = relations(companyFollowUp, ({ one, many }) => ({
  company: one(company, {
    fields: [companyFollowUp.companyId],
    references: [company.companyId],
  }),
  staff: one(staff, {
    fields: [companyFollowUp.authorId],
    references: [staff.staffId],
  }),
  contact: one(contact, {
    fields: [companyFollowUp.contactId],
    references: [contact.contactId],
  }),
  foreignFollowUpCompanyNotifications: many(foreignFollowUpCompanyNotification),
}));

export const contactRelations = relations(contact, ({ many }) => ({
  companyFollowUps: many(companyFollowUp),
  constructionFollowUps: many(constructionFollowUp),
  contactCompanies: many(contactCompany),
  contactConstructions: many(contactConstruction),
  contactEdits: many(contactEdits),
  contactProjects: many(contactProject),
  projectFollowUps: many(projectFollowUp),
}));

export const constructionCompanyRoleRelations = relations(constructionCompanyRole, ({ one }) => ({
  construction: one(construction, {
    fields: [constructionCompanyRole.constructionId],
    references: [construction.constructionId],
  }),
  company: one(company, {
    fields: [constructionCompanyRole.companyId],
    references: [company.companyId],
  }),
}));

export const constructionRelations = relations(construction, ({ many }) => ({
  constructionCompanyRoles: many(constructionCompanyRole),
  constructionEdits: many(constructionEdits),
  constructionFollowUps: many(constructionFollowUp),
  contactConstructions: many(contactConstruction),
  projects: many(project),
  staffConstructionAssignments: many(staffConstructionAssignment),
}));

export const constructionEditsRelations = relations(constructionEdits, ({ one }) => ({
  construction: one(construction, {
    fields: [constructionEdits.constructionId],
    references: [construction.constructionId],
  }),
  staff: one(staff, {
    fields: [constructionEdits.authorId],
    references: [staff.staffId],
  }),
}));

export const constructionFollowUpRelations = relations(constructionFollowUp, ({ one, many }) => ({
  staff: one(staff, {
    fields: [constructionFollowUp.authorId],
    references: [staff.staffId],
  }),
  contact: one(contact, {
    fields: [constructionFollowUp.contactId],
    references: [contact.contactId],
  }),
  company: one(company, {
    fields: [constructionFollowUp.companyId],
    references: [company.companyId],
  }),
  construction: one(construction, {
    fields: [constructionFollowUp.constructionId],
    references: [construction.constructionId],
  }),
  foreignFollowUpConstructionNotifications: many(foreignFollowUpConstructionNotification),
}));

export const contactCompanyRelations = relations(contactCompany, ({ one }) => ({
  contact: one(contact, {
    fields: [contactCompany.contactId],
    references: [contact.contactId],
  }),
  company: one(company, {
    fields: [contactCompany.companyId],
    references: [company.companyId],
  }),
}));

export const contactConstructionRelations = relations(contactConstruction, ({ one }) => ({
  contact: one(contact, {
    fields: [contactConstruction.contactId],
    references: [contact.contactId],
  }),
  construction: one(construction, {
    fields: [contactConstruction.constructionId],
    references: [construction.constructionId],
  }),
}));

export const contactEditsRelations = relations(contactEdits, ({ one }) => ({
  contact: one(contact, {
    fields: [contactEdits.contactId],
    references: [contact.contactId],
  }),
  staff: one(staff, {
    fields: [contactEdits.authorId],
    references: [staff.staffId],
  }),
}));

export const contactProjectRelations = relations(contactProject, ({ one }) => ({
  contact: one(contact, {
    fields: [contactProject.contactId],
    references: [contact.contactId],
  }),
  project: one(project, {
    fields: [contactProject.projectId],
    references: [project.projectId],
  }),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  contactProjects: many(contactProject),
  staff: one(staff, {
    fields: [project.authorId],
    references: [staff.staffId],
  }),
  construction: one(construction, {
    fields: [project.constructionId],
    references: [construction.constructionId],
  }),
  company: one(company, {
    fields: [project.companyId],
    references: [company.companyId],
  }),
  projectEdits: many(projectEdits),
  projectFollowUps: many(projectFollowUp),
  projectProducts: many(projectProduct),
  staffProjectAssignments: many(staffProjectAssignment),
}));

export const foreignFollowUpCompanyNotificationRelations = relations(
  foreignFollowUpCompanyNotification,
  ({ one }) => ({
    staff_authorId: one(staff, {
      fields: [foreignFollowUpCompanyNotification.authorId],
      references: [staff.staffId],
      relationName: "foreignFollowUpCompanyNotification_authorId_staff_staffId",
    }),
    staff_deliveredToId: one(staff, {
      fields: [foreignFollowUpCompanyNotification.deliveredToId],
      references: [staff.staffId],
      relationName: "foreignFollowUpCompanyNotification_deliveredToId_staff_staffId",
    }),
    companyFollowUp: one(companyFollowUp, {
      fields: [foreignFollowUpCompanyNotification.followUpId],
      references: [companyFollowUp.followUpId],
    }),
  }),
);

export const foreignFollowUpConstructionNotificationRelations = relations(
  foreignFollowUpConstructionNotification,
  ({ one }) => ({
    staff_authorId: one(staff, {
      fields: [foreignFollowUpConstructionNotification.authorId],
      references: [staff.staffId],
      relationName: "foreignFollowUpConstructionNotification_authorId_staff_staffId",
    }),
    staff_deliveredToId: one(staff, {
      fields: [foreignFollowUpConstructionNotification.deliveredToId],
      references: [staff.staffId],
      relationName: "foreignFollowUpConstructionNotification_deliveredToId_staff_staffId",
    }),
    constructionFollowUp: one(constructionFollowUp, {
      fields: [foreignFollowUpConstructionNotification.followUpId],
      references: [constructionFollowUp.followUpId],
    }),
  }),
);

export const foreignFollowUpProjectNotificationRelations = relations(
  foreignFollowUpProjectNotification,
  ({ one }) => ({
    staff_authorId: one(staff, {
      fields: [foreignFollowUpProjectNotification.authorId],
      references: [staff.staffId],
      relationName: "foreignFollowUpProjectNotification_authorId_staff_staffId",
    }),
    staff_deliveredToId: one(staff, {
      fields: [foreignFollowUpProjectNotification.deliveredToId],
      references: [staff.staffId],
      relationName: "foreignFollowUpProjectNotification_deliveredToId_staff_staffId",
    }),
    projectFollowUp: one(projectFollowUp, {
      fields: [foreignFollowUpProjectNotification.followUpId],
      references: [projectFollowUp.followUpId],
    }),
  }),
);

export const projectFollowUpRelations = relations(projectFollowUp, ({ one, many }) => ({
  foreignFollowUpProjectNotifications: many(foreignFollowUpProjectNotification),
  project: one(project, {
    fields: [projectFollowUp.projectId],
    references: [project.projectId],
  }),
  staff: one(staff, {
    fields: [projectFollowUp.authorId],
    references: [staff.staffId],
  }),
  contact: one(contact, {
    fields: [projectFollowUp.contactId],
    references: [contact.contactId],
  }),
  company: one(company, {
    fields: [projectFollowUp.companyId],
    references: [company.companyId],
  }),
}));

export const projectEditsRelations = relations(projectEdits, ({ one }) => ({
  project: one(project, {
    fields: [projectEdits.projectId],
    references: [project.projectId],
  }),
  staff: one(staff, {
    fields: [projectEdits.authorId],
    references: [staff.staffId],
  }),
}));

export const projectProductRelations = relations(projectProduct, ({ one }) => ({
  project: one(project, {
    fields: [projectProduct.projectId],
    references: [project.projectId],
  }),
}));

export const staffCompanyAssignmentRelations = relations(staffCompanyAssignment, ({ one }) => ({
  staff: one(staff, {
    fields: [staffCompanyAssignment.staffId],
    references: [staff.staffId],
  }),
  company: one(company, {
    fields: [staffCompanyAssignment.companyId],
    references: [company.companyId],
  }),
}));

export const staffConstructionAssignmentRelations = relations(
  staffConstructionAssignment,
  ({ one }) => ({
    staff: one(staff, {
      fields: [staffConstructionAssignment.staffId],
      references: [staff.staffId],
    }),
    construction: one(construction, {
      fields: [staffConstructionAssignment.constructionId],
      references: [construction.constructionId],
    }),
  }),
);

export const staffProjectAssignmentRelations = relations(staffProjectAssignment, ({ one }) => ({
  staff: one(staff, {
    fields: [staffProjectAssignment.staffId],
    references: [staff.staffId],
  }),
  project: one(project, {
    fields: [staffProjectAssignment.projectId],
    references: [project.projectId],
  }),
}));
