# Midnight Watch // Secure Channel

## Overview

This project is a Vue.js application that creates a futuristic, secure channel interface for a clandestine organization called the "Midnight Watch." It features a dark, cyberpunk-inspired design with a consistent UI across several views. The application is designed to be a portal for operatives to access classified information.

## Design & Style Guide

- **Theme:** Dark, futuristic, and mysterious, with glowing text, sharp lines, and a high-tech aesthetic.
- **Color Palette:** Dominated by a dark blue/black background (`--bg-dark`), with accents of gold (`--accent-gold`), cyan (`--accent-cyan`), and red (`--accent-danger`).
- **Typography:** Uses a primary sans-serif font and a monospace font (`--font-mono`) for titles, labels, and system messages to enhance the technical feel.
- **UI Components:** Features consistent card designs (`titan-card`, `id-card`), custom input fields, and a persistent top navigation bar.
- **Visual Effects:** Incorporates subtle animations, scroll-based fade-in effects, and interactive elements like a 3D-tilting ID card to create an immersive experience.

## Current Application Features

- **Home Page:**
  - A landing page with an animated hero logo and introduction to the organization.
  - Includes a **Mock Login & Sign-up System**. This is a front-end simulation only; no data is stored, and authentication is hardcoded. The sign-up form provides UI feedback but does not persist new users.

- **Consistent Navigation:**
  - A sticky top navigation bar is present on all pages, allowing easy access to all sections of the application.

- **Data Views (Read-Only):**
  - All data is currently read from static `JSON` files located in the `public/data/` directory.
  - **Bestiary:** Displays a searchable and filterable list of anomalous entities.
  - **Missions:** Displays a list of active and past operational objectives.
  - **Reliquary:** Displays a list of contained paranormal artifacts.

- **Personnel Page (Interactive Mock-up):**
  - An "Operative Dossier Builder" that allows a user to fill out a form.
  - The form data dynamically updates a preview of an operative's ID card in real-time.
  - This is a UI mock-up, and the generated dossier is not saved.

## Next Steps: Full-Stack Implementation Plan

The following plan outlines the steps needed to convert the application from a front-end mock-up to a fully functional, data-persistent web application.

### Phase 1: Implement Real User Authentication

The current login system is a placeholder. The first step is to build a secure authentication system.

- **1. Integrate Firebase Authentication:**
  - Set up a new Firebase project.
  - Add Firebase SDK to the Vue application.
  - Use Firebase Authentication to manage user accounts.

- **2. Convert Mock Forms:**
  - Update the "Enlistment" (Sign-up) form on `Home.vue` to create new users in Firebase Authentication.
  - Update the "Operative Login" form to authenticate users against Firebase.

- **3. Implement Protected Routes:**
  - Use Vue Router's navigation guards to prevent unauthenticated users from accessing any page except the `Home` page.
  - Users attempting to access protected pages will be redirected to the login form.

- **4. Add Logout Functionality:**
  - Create a logout button or mechanism that clears the user's session and redirects them to the `Home` page.

### Phase 2: Database Migration to Firestore

Static JSON files will be replaced with a real-time database to allow for dynamic data management.

- **1. Set up Firestore:**
  - In the same Firebase project, enable the Firestore real-time database.

- **2. Data Migration:**
  - Create collections in Firestore for `bestiary`, `missions`, `reliquary`, and `personnel`.
  - Migrate the data from the existing JSON files into their corresponding Firestore collections.

- **3. Refactor Data Fetching:**
  - Update the `Bestiary.vue`, `Missions.vue`, `Reliquary.vue`, and `Personnel.vue` pages to fetch data directly and in real-time from Firestore instead of the static JSON files.

### Phase 3: Build the Admin Layer

To make the application's content manageable, a dedicated, secure admin section is required.

- **1. Design Admin Views:**
  - Create a new set of Vue components for the admin dashboard (e.g., `AdminDashboard.vue`, `AdminBestiary.vue`, `AdminMissions.vue`).
  - These views will contain forms and tables for Create, Read, Update, and Delete (CRUD) operations.

- **2. Implement CRUD Functionality:**
  - Write the functions to add, edit, and delete documents in the `bestiary`, `missions`, and `reliquary` Firestore collections from the admin views.

- **3. Secure Admin Routes:**
  - Implement role-based access control. A user's document in Firestore should have an `isAdmin: true` flag.
  - Create a navigation guard in Vue Router that checks if the authenticated user has the `isAdmin` flag before allowing access to any `/admin` routes.

### Phase 4: Connect Personnel Dossier to Database

The final step is to make the dossier builder functional.

- **1. Save New Operatives:**
  - In `Personnel.vue`, update the "Submit for Encryption" button to save the form data as a new document in the `personnel` collection in Firestore.
- **2. Display Operative List:**
  - Enhance the `Personnel.vue` page to display a list of all existing operatives from the database.
