import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  type InsertCompany,
  type InsertConstruction,
  type InsertConstructionCompanyRole,
  type InsertProject,
  type InsertContact,
  type InsertStaff,
  type InsertCompanyFollowUp,
  type InsertConstructionFollowUp,
  type InsertProjectFollowUp,
  company,
  construction,
  constructionCompanyRole,
  project,
  contact,
  contactCompany,
  contactConstruction,
  contactProject,
  staff,
  staffCompanyAssignment,
  staffConstructionAssignment,
  staffProjectAssignment,
  companyFollowUp,
  constructionFollowUp,
  projectFollowUp,
  companyRoles,
  commonFollowUps,
  milestones,
  productNames,
  projectProduct,
  companyEdits,
  constructionEdits,
  contactEdits,
} from "./schema";
import { format } from "date-fns";
import { faker } from "@faker-js/faker";

/*** --- MAIN --- ***/
console.log("Seeding database...");
seed(
  42,
  {
    numCompanies: 100,
    numConstructions: 300,
    numCompaniesPerConstruction: [1, 3],
    numProjects: 200,
    numContacts: 400,
    numCompaniesPerStaff: [30, 60],
    numConstructionsPerStaff: [20, 40],
    numProjectsPerStaff: [30, 40],
    numConstructionsToEdit: 0,
  },
  false,
)
  .then(() => {
    console.log("Database seeding completed successfully!");
  })
  .catch((error) => {
    console.error("Unhandled error during seeding:", error);
  })
  .finally(() => {
    process.exit(0);
  });

/*** --- MAIN --- ***/

interface SeedOptions {
  numCompanies: number;
  numConstructions: number;
  numCompaniesPerConstruction: number[];
  numProjects: number;
  numContacts: number;
  numCompaniesPerStaff: number[];
  numConstructionsPerStaff: number[];
  numProjectsPerStaff: number[];
  numConstructionsToEdit: number;
}

async function seed(seed: number, options: SeedOptions, onlyStaff = false) {
  faker.seed(seed);

  if (onlyStaff) {
    await insertStaff();
    return;
  }

  const {
    numCompanies,
    numConstructions,
    numCompaniesPerConstruction,
    numProjects,
    numContacts,
    numCompaniesPerStaff,
    numConstructionsPerStaff,
    numProjectsPerStaff,
    numConstructionsToEdit,
  } = options;

  // Arrays to keep track of inserted data
  const companies: InsertCompany[] = [];
  const constructions: InsertConstruction[] = [];
  const constructionCompanyRoles: InsertConstructionCompanyRole[] = [];
  const projects: InsertProject[] = [];
  const contacts: InsertContact[] = [];
  const staffs: InsertStaff[] = [];

  // 1. Insert Companies
  for (let i = 0; i < numCompanies; i++) {
    const companyData: InsertCompany = {
      name: faker.company.name(),
      country: faker.location.country(),
      freeText: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 }), "\n\n"),
    };

    const result = await db.insert(company).values(companyData);
    const companyId = result[0].insertId;
    companies.push({ ...companyData, companyId });
  }

  // 2. Insert Constructions
  for (let i = 0; i < numConstructions; i++) {
    const constructionData: InsertConstruction = {
      name: faker.commerce.productName(),
      powerCapacity: faker.number.float({ min: 1, max: 1000 }),
      sector: faker.commerce.department(),
      city: faker.location.city(),
      country: faker.location.country(),
      type: faker.helpers.arrayElement([
        "New",
        "Renovation",
        "Expansion",
        "Redevelopment",
        "Upgrade",
      ]),
      constructionValue: faker.number.float({ min: 10, max: 10000 }),
      freeText: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 }), "\n\n"),
    };

    const result = await db.insert(construction).values(constructionData);
    const constructionId = result[0].insertId;
    constructions.push({ ...constructionData, constructionId });
  }

  // 3. Associate Companies with Constructions
  for (const constructionItem of constructions) {
    // Assign 1-3 companies to each construction
    const numAssignedCompanies = faker.number.int({
      min: numCompaniesPerConstruction[0],
      max: numCompaniesPerConstruction[1],
    });
    const selectedCompanyRoles = faker.helpers.arrayElements(companyRoles, numAssignedCompanies);
    const selectedCompanies = faker.helpers.arrayElements(companies, numAssignedCompanies);

    for (let i = 0; i < numAssignedCompanies; i++) {
      const roleData: InsertConstructionCompanyRole = {
        constructionId: constructionItem.constructionId!,
        companyId: selectedCompanies[i].companyId!,
        role: selectedCompanyRoles[i],
      };

      const result = await db.insert(constructionCompanyRole).values(roleData);
      const roleId = result[0].insertId;
      constructionCompanyRoles.push({ ...roleData, roleId });
    }
  }

  // 4. Insert Projects
  for (let i = 0; i < numProjects; i++) {
    // Select a construction
    const constructionItem = faker.helpers.arrayElement(constructions);

    // Get companies associated with this construction
    const companyIds = constructionCompanyRoles
      .filter((role) => role.constructionId === constructionItem.constructionId)
      .map((role) => role.companyId);

    const companiesForConstruction = companies.filter((comp) =>
      companyIds.includes(comp.companyId!),
    );

    // Ensure there is at least one company associated
    if (companiesForConstruction.length === 0) continue;

    // Select one company
    const companyItem = faker.helpers.arrayElement(companiesForConstruction);

    const projectData: InsertProject = {
      constructionId: constructionItem.constructionId!,
      companyId: companyItem.companyId!,
      name: faker.commerce.productName(),
      milestone: faker.helpers.arrayElement(milestones),
      saleProbability: faker.number.float({ min: 0, max: 100 }),
      freeText: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 }), "\n\n"),
    };

    const result = await db.insert(project).values(projectData);
    const projectId = result[0].insertId;
    projects.push({ ...projectData, projectId });

    // Add products to the project
    const proyectProducts = faker.helpers.arrayElements(
      productNames,
      faker.number.int({ min: 1, max: 3 }),
    );
    for (const product of proyectProducts) {
      const productData = {
        projectId: projectId,
        productName: product,
      };
      await db.insert(projectProduct).values(productData);
    }
  }

  // 5. Insert Contacts
  for (let i = 0; i < numContacts; i++) {
    const contactData = {
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
      freeText: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 }), "\n\n"),
    };

    const result = await db.insert(contact).values(contactData);
    const contactId = result[0].insertId;
    contacts.push({ ...contactData, contactId });
  }

  // 6. Associate Contacts with Companies, Constructions, and Projects
  for (const contactItem of contacts) {
    // Randomly assign 1-2 companies
    let numAssignedCompanies = 1;
    if (faker.number.float() < 0.05) {
      numAssignedCompanies = 2;
    }
    const selectedCompanies = faker.helpers.arrayElements(companies, numAssignedCompanies);

    for (const companyItem of selectedCompanies) {
      const contactCompanyData = {
        contactId: contactItem.contactId!,
        companyId: companyItem.companyId!,
        position: faker.person.jobTitle(),
      };

      await db.insert(contactCompany).values(contactCompanyData);
    }

    // Randomly assign 1-3 constructions associated with the contact's companies
    const constructionIds = constructionCompanyRoles
      .filter((role) => selectedCompanies.some((comp) => comp.companyId === role.companyId))
      .map((role) => role.constructionId);

    const constructionsForContact = constructions.filter((cons) =>
      constructionIds.includes(cons.constructionId!),
    );

    const numConstructions = Math.min(
      faker.number.int({ min: 1, max: 3 }),
      constructionsForContact.length,
    );

    const selectedConstructions = faker.helpers.arrayElements(
      constructionsForContact,
      numConstructions,
    );

    for (const constructionItem of selectedConstructions) {
      const contactConstructionData = {
        contactId: contactItem.contactId!,
        constructionId: constructionItem.constructionId!,
      };

      await db.insert(contactConstruction).values(contactConstructionData);
    }

    // Randomly assign 1-3 projects associated with the contact's constructions
    const projectsForContact = projects.filter((proj) =>
      selectedConstructions.some((cons) => cons.constructionId === proj.constructionId),
    );

    const numProjects = Math.min(faker.number.int({ min: 1, max: 3 }), projectsForContact.length);

    const selectedProjects = faker.helpers.arrayElements(projectsForContact, numProjects);

    for (const projectItem of selectedProjects) {
      const contactProjectData = {
        contactId: contactItem.contactId!,
        projectId: projectItem.projectId!,
      };

      await db.insert(contactProject).values(contactProjectData);
    }
  }

  // 7. Insert Staff
  staffs.push(...(await insertStaff()));

  // 8. Assign Staff to Companies
  for (const staffItem of staffs) {
    const numCompanies = faker.number.int({
      min: numCompaniesPerStaff[0],
      max: numCompaniesPerStaff[1],
    });
    const selectedCompanies = faker.helpers.arrayElements(companies, numCompanies);

    for (const companyItem of selectedCompanies) {
      const staffCompanyAssignmentData = {
        staffId: staffItem.staffId!,
        companyId: companyItem.companyId!,
        isArchived: false,
        nextFollowUpDate: faker.date
          .between({
            from: currentDatePlusDays(-50),
            to: currentDatePlusDays(90),
          })
          .toISOString()
          .split("T")[0],
        nextFollowUpNote: faker.lorem.sentence(),
      };

      await db.insert(staffCompanyAssignment).values(staffCompanyAssignmentData);

      // Insert Follow-Up for Company Assignment
      const numFollowUps = faker.number.int({ min: 0, max: 5 });
      for (let i = 0; i < numFollowUps; i++) {
        const followUpData: InsertCompanyFollowUp = {
          companyId: companyItem.companyId!,
          authorId: staffItem.staffId!,
          contactId: null, // Assuming no contact is directly associated
          type: randomFollowUp(),
          createdAt: faker.date
            .between({
              from: currentDatePlusDays(-365),
              to: currentDatePlusDays(-1),
            })
            .toISOString()
            .split("T")[0],
          body: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 5 }), "\n\n"),
          nextFollowUpDate: staffCompanyAssignmentData.nextFollowUpDate,
          nextFollowUpNote: staffCompanyAssignmentData.nextFollowUpNote,
        };

        await db.insert(companyFollowUp).values(followUpData);
      }
    }
  }

  // 9. Assign Staff to Constructions
  for (const staffItem of staffs) {
    // Get companies assigned to the staff
    const assignedCompanyRows = await db
      .select({
        companyId: staffCompanyAssignment.companyId,
      })
      .from(staffCompanyAssignment)
      .where(eq(staffCompanyAssignment.staffId, staffItem.staffId!));

    const companyIds = assignedCompanyRows.map((row) => row.companyId);

    // Get constructions associated with these companies
    const constructionIds = constructionCompanyRoles
      .filter((role) => companyIds.includes(role.companyId))
      .map((role) => role.constructionId);

    const constructionsForStaff = constructions.filter((cons) =>
      constructionIds.includes(cons.constructionId!),
    );

    if (constructionsForStaff.length === 0) continue;

    const numConstructions = faker.number.int({
      min: Math.min(numConstructionsPerStaff[0], constructionsForStaff.length),
      max: Math.min(numConstructionsPerStaff[1], constructionsForStaff.length),
    });

    const selectedConstructions = faker.helpers.arrayElements(
      constructionsForStaff,
      numConstructions,
    );

    for (const constructionItem of selectedConstructions) {
      const staffConstructionAssignmentData = {
        staffId: staffItem.staffId!,
        constructionId: constructionItem.constructionId!,
        isArchived: false,
        nextFollowUpDate: faker.date
          .between({
            from: currentDatePlusDays(-50),
            to: currentDatePlusDays(90),
          })
          .toISOString()
          .split("T")[0],
        nextFollowUpNote: faker.lorem.sentence(),
      };

      await db.insert(staffConstructionAssignment).values(staffConstructionAssignmentData);

      // Insert Follow-Up for Construction Assignment
      const numFollowUps = faker.number.int({ min: 0, max: 5 });
      for (let i = 0; i < numFollowUps; i++) {
        const followUpData: InsertConstructionFollowUp = {
          constructionId: constructionItem.constructionId!,
          authorId: staffItem.staffId!,
          contactId: null, // Assuming no contact is directly associated
          type: randomFollowUp(),
          createdAt: faker.date
            .between({
              from: currentDatePlusDays(-365),
              to: currentDatePlusDays(-1),
            })
            .toISOString()
            .split("T")[0],
          body: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 5 }), "\n\n"),
          nextFollowUpDate: staffConstructionAssignmentData.nextFollowUpDate,
          nextFollowUpNote: staffConstructionAssignmentData.nextFollowUpNote,
        };

        await db.insert(constructionFollowUp).values(followUpData);
      }
    }
  }

  // 10. Assign Staff to Projects
  for (const staffItem of staffs) {
    // Get constructions assigned to the staff
    const assignedConstructionRows = await db
      .select({
        constructionId: staffConstructionAssignment.constructionId,
      })
      .from(staffConstructionAssignment)
      .where(eq(staffConstructionAssignment.staffId, staffItem.staffId!));

    const constructionIds = assignedConstructionRows.map((row) => row.constructionId);

    // Get projects associated with these constructions
    const projectsForStaff = projects.filter((proj) =>
      constructionIds.includes(proj.constructionId),
    );

    if (projectsForStaff.length === 0) continue;

    const numProjects = faker.number.int({
      min: Math.min(numProjectsPerStaff[0], projectsForStaff.length),
      max: Math.min(numProjectsPerStaff[1], projectsForStaff.length),
    });

    const selectedProjects = faker.helpers.arrayElements(projectsForStaff, numProjects);

    for (const projectItem of selectedProjects) {
      const staffProjectAssignmentData = {
        staffId: staffItem.staffId!,
        projectId: projectItem.projectId!,
        isArchived: false,
        nextFollowUpDate: faker.date
          .between({
            from: currentDatePlusDays(-50),
            to: currentDatePlusDays(90),
          })
          .toISOString()
          .split("T")[0],
        nextFollowUpNote: faker.number.float() < 0.9 ? faker.lorem.sentence() : null,
      };

      await db.insert(staffProjectAssignment).values(staffProjectAssignmentData);

      // Insert Follow-Up for Project Assignment
      const numFollowUps = faker.number.int({ min: 0, max: 15 });
      for (let i = 0; i < numFollowUps; i++) {
        const followUpData: InsertProjectFollowUp = {
          projectId: projectItem.projectId!,
          authorId: staffItem.staffId!,
          contactId: null, // Assuming no contact is directly associated
          type: randomFollowUp(),
          createdAt: faker.date
            .between({
              from: currentDatePlusDays(-365),
              to: currentDatePlusDays(-1),
            })
            .toISOString()
            .split("T")[0],
          body: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 5 }), "\n\n"),
          nextFollowUpDate: staffProjectAssignmentData.nextFollowUpDate,
          nextFollowUpNote: staffProjectAssignmentData.nextFollowUpNote,
        };

        await db.insert(projectFollowUp).values(followUpData);
      }
    }
  }

  // 11. Add edits to some companies
  const companiesToEdit = faker.helpers.arrayElements(companies, 20);
  for (const companyItem of companiesToEdit) {
    const numEdits = faker.number.int({ min: 0, max: 3 });

    if (numEdits === 0) continue; // Skip if no edits

    // Initialize the current state with the company's initial data
    const currentState: {
      name: string | null;
      address: string | null;
      phoneNumber: string | null;
      freeText: string | null;
    } = {
      name: null,
      address: null,
      phoneNumber: null,
      freeText: null,
    };

    // Initialize the first edit date
    let lastEditDate = faker.date.past();

    // Generate edits
    for (let i = 0; i < numEdits; i++) {
      // Increment the date for each subsequent edit
      const editDate = incrementDate(lastEditDate);
      lastEditDate = editDate;

      // Decide which fields to update
      const updateName = faker.number.float() < 0.4;
      const updateAddress = faker.number.float() < 0.4;
      const updatePhoneNumber = faker.number.float() < 0.4;
      const updateNote = faker.number.float() < 0.4;

      // Update the current state based on random decisions
      if (updateName) {
        currentState.name = faker.company.name();
      }
      if (updateAddress) {
        currentState.address = faker.location.streetAddress();
      }
      if (updatePhoneNumber) {
        currentState.phoneNumber = faker.phone.number();
      }
      if (updateNote) {
        currentState.freeText = faker.lorem.paragraphs(
          faker.number.int({ min: 1, max: 3 }),
          "\n\n",
        );
      }

      // Prepare the edit data with the current state
      const editData = {
        companyId: companyItem.companyId!,
        authorId: faker.helpers.arrayElement(staffs).staffId!,
        createdAt: formatDatetime(editDate),
        name: currentState.name,
        address: currentState.address,
        phoneNumber: currentState.phoneNumber,
        freeText: currentState.freeText,
      };

      await db.insert(companyEdits).values(editData);
    }
  }

  // 12. Add edits to some constructions
  const constructionsToEdit = faker.helpers.arrayElements(constructions, numConstructionsToEdit);
  for (const constructionItem of constructionsToEdit) {
    const numEdits = faker.number.int({ min: 0, max: 3 });

    if (numEdits === 0) continue; // Skip if no edits

    // Initialize the current state with the construction's initial data
    const currentState: {
      name: string | null;
      powerCapacity: number | null;
      sector: string | null;
      city: string | null;
      country: string | null;
      freeText: string | null;
    } = {
      name: null,
      powerCapacity: null,
      sector: null,
      city: null,
      country: null,
      freeText: null,
    };

    // Initialize the first edit date
    let lastEditDate = faker.date.past();

    // Generate edits
    for (let i = 0; i < numEdits; i++) {
      // Increment the date for each subsequent edit
      const editDate = incrementDate(lastEditDate);
      lastEditDate = editDate;

      // Decide which fields to update
      const updateName = faker.number.float() < 0.4;
      const updatePowerCapacity = faker.number.float() < 0.4;
      const updateSector = faker.number.float() < 0.4;
      const updateCity = faker.number.float() < 0.4;
      const updateCountry = faker.number.float() < 0.4;
      const updateNote = faker.number.float() < 0.4;

      // Update the current state based on random decisions
      if (updateName) {
        currentState.name = faker.commerce.productName();
      }
      if (updatePowerCapacity) {
        currentState.powerCapacity = faker.number.float({ min: 1, max: 1000 });
      }
      if (updateSector) {
        currentState.sector = faker.commerce.department();
      }
      if (updateCity) {
        currentState.city = faker.location.city();
      }
      if (updateCountry) {
        currentState.country = faker.location.country();
      }
      if (updateNote) {
        currentState.freeText = faker.lorem.paragraphs(
          faker.number.int({ min: 1, max: 3 }),
          "\n\n",
        );
      }

      // Prepare the edit data with the current state
      const editData = {
        constructionId: constructionItem.constructionId!,
        authorId: faker.helpers.arrayElement(staffs).staffId!,
        createdAt: formatDatetime(editDate),
        name: currentState.name,
        powerCapacity: currentState.powerCapacity,
        sector: currentState.sector,
        city: currentState.city,
        country: currentState.country,
        freeText: currentState.freeText,
      };

      await db.insert(constructionEdits).values(editData);
    }
  }

  // 13. Add edits to some contacts
  const contactsToEdit = faker.helpers.arrayElements(contacts, 20);
  for (const contactItem of contactsToEdit) {
    const numEdits = faker.number.int({ min: 0, max: 3 });

    if (numEdits === 0) continue; // Skip if no edits

    // Initialize the current state with the contact's initial data
    const currentState: {
      name: string | null;
      phoneNumber: string | null;
      email: string | null;
      freeText: string | null;
    } = {
      name: null,
      phoneNumber: null,
      email: null,
      freeText: null,
    };

    // Initialize the first edit date
    let lastEditDate = faker.date.past();

    // Generate edits
    for (let i = 0; i < numEdits; i++) {
      // Increment the date for each subsequent edit
      const editDate = incrementDate(lastEditDate);
      lastEditDate = editDate;

      // Decide which fields to update
      const updateName = faker.number.float() < 0.4;
      const updatePhoneNumber = faker.number.float() < 0.4;
      const updateEmail = faker.number.float() < 0.4;
      const updateNote = faker.number.float() < 0.4;

      // Update the current state based on random decisions
      if (updateName) {
        currentState.name = faker.person.fullName();
      }
      if (updatePhoneNumber) {
        currentState.phoneNumber = faker.phone.number();
      }
      if (updateEmail) {
        currentState.email = faker.internet.email();
      }
      if (updateNote) {
        currentState.freeText = faker.lorem.paragraphs(
          faker.number.int({ min: 1, max: 3 }),
          "\n\n",
        );
      }

      // Prepare the edit data with the current state
      const editData = {
        contactId: contactItem.contactId!,
        authorId: faker.helpers.arrayElement(staffs).staffId!,
        createdAt: formatDatetime(editDate),
        name: currentState.name,
        phoneNumber: currentState.phoneNumber,
        email: currentState.email,
        freeText: currentState.freeText,
      };

      await db.insert(contactEdits).values(editData);
    }
  }
}

async function insertStaff() {
  const staffDataList = [
    { staffId: 1, login: "tsegui", name: "Toni Seguí", email: "tsegui@at3w.com" },
    {
      staffId: 2,
      login: "fcomoya",
      name: "Francisco Moya",
      email: "fcomoya@at3w.com",
    },
    { staffId: 3, login: "rcosta", name: "Roberto Costa", email: "rcosta@at3w.com" },
    {
      staffId: 4,
      login: "lrolando",
      name: "Laure Rolando",
      email: "lrolando@at3w.com",
    },
    {
      staffId: 5,
      login: "ivalero",
      name: "Isabel Valero",
      email: "ivalero@at3w.com",
    },
    {
      staffId: 6,
      login: "mrodrigues",
      name: "Manuel Antonio Rodrigues",
      email: "manuelantonio@at3w.com",
    },
    { staffId: 7, login: "gruiz", name: "Gregorio Ruiz", email: "gruiz@at3w.com" },
    { staffId: 8, login: "jsimon", name: "Jorge Simón", email: "jsimon@at3w.com" },
    {
      staffId: 9,
      login: "rrodrigues",
      name: "Rita Rodrigues",
      email: "rrodrigues@at3w.com",
    },
    { staffId: 10, login: "lmora", name: "Laura Mora", email: "lmora@at3w.com" },
    {
      staffId: 11,
      login: "cripoll",
      name: "Carmen Ripoll",
      email: "cripoll@at3w.com",
    },
    { staffId: 12, login: "ssimon", name: "Sergio Simón", email: "ssimon@at3w.com" },
    {
      staffId: 13,
      login: "bvega",
      name: "Bernat de la Vega",
      email: "bvega@at3w.com",
    },
    {
      staffId: 14,
      login: "pferrando",
      name: "Pablo Ferrando",
      email: "pferrando@at3w.com",
    },
    {
      staffId: 15,
      login: "nsweeting",
      name: "Nick Sweeting",
      email: "nsweeting@at3w.com",
    },
    {
      staffId: 16,
      login: "aaraque",
      name: "Ángel Araque",
      email: "aaraque@at3w.com",
    },
    { staffId: 17, login: "jdevis", name: "José Devis", email: "jdevis@at3w.com" },
    { staffId: 18, login: "amuzzi", name: "Alex Muzzi", email: "amuzzi@at3w.com" },
    {
      staffId: 19,
      login: "mbernal",
      name: "Manuel Bernal",
      email: "mbernal@at3w.com",
    },
    {
      staffId: 20,
      login: "dgonzalez",
      name: "David González",
      email: "dgonzalez@at3w.com",
    },
    { staffId: 21, login: "bpuig", name: "Begoña Puig", email: "bpuig@at3w.com" },
    {
      staffId: 22,
      login: "jpetouris",
      name: "Jorge Petouris",
      email: "jpetouris@at3w.com",
    },
    {
      staffId: 23,
      login: "ltarazona",
      name: "Lola Tarazona",
      email: "ltarazona@at3w.com",
    },
    {
      staffId: 24,
      login: "ebargues",
      name: "Edgard Bargues",
      email: "ebargues@at3w.com",
    },
    {
      staffId: 25,
      login: "msiguero",
      name: "Marta Siguero",
      email: "msiguero@at3w.com",
    },
    {
      staffId: 26,
      login: "sbarahona",
      name: "Silvia Barahona",
      email: "sbarahona@at3w.com",
    },
    {
      staffId: 28,
      login: "bcastillo",
      name: "Borja Castillo",
      email: "bcastillo@at3w.com",
    },
    {
      staffId: 29,
      login: "scesar",
      name: "Stefany Cesar",
      email: "scesar@at3w.com",
    },
    {
      staffId: 30,
      login: "gsoria",
      name: "Guillermo Soria",
      email: "gsoria@at3w.com",
    },
    {
      staffId: 31,
      login: "mcronin",
      name: "Mark Cronin",
      email: "mcronin@at3w.com",
    },
    {
      staffId: 32,
      login: "lalvarez",
      name: "Lucía Álvarez",
      email: "lalvarez@at3w.com",
    },
    {
      staffId: 33,
      login: "lmeteier",
      name: "Louise Météier",
      email: "lmeteier@at3w.com",
    },
    { staffId: 34, login: "pcano", name: "Pedro Cano", email: "pcano@at3w.com" },
  ];

  for (const staffData of staffDataList) {
    await db.insert(staff).values(staffData);
  }

  return staffDataList;
}

/*** --- UTILS --- ***/
function randomFollowUp() {
  return faker.helpers.arrayElement(
    commonFollowUps.filter(
      (type) => type !== "Archived" && type !== "Unarchived" && type !== "Edit",
    ),
  );
}

function currentDatePlusDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function formatDatetime(date: Date) {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}

function incrementDate(baseDate: Date, maxDays = 30) {
  const daysToAdd = faker.number.int({ min: 1, max: maxDays });
  const newDate = new Date(baseDate);
  newDate.setDate(newDate.getDate() + daysToAdd);
  return newDate;
}
