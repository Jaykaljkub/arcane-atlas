
# Midnight Watch // Secure Channel

## Overview

This project is a Vue.js application that creates a futuristic, secure channel interface. It features a Three.js animated background, scroll-based animations, and a mock login system.

## Project Structure

- `public/`:
  - `data/`:
    - `bestiary.json`: Contains the data for the Bestiary page.
- `src/`:
  - `assets/`:
    - `styles.css`: All the application's styles.
  - `router/`:
    - `index.js`: The router configuration.
  - `views/`:
    - `Home.vue`: The main view of the application.
    - `Bestiary.vue`: The Bestiary page.
- `index.html`: The main HTML file, which includes the Three.js library.
- `App.vue`: The root Vue component, which renders the router view.
- `main.js`: The entry point of the application, which imports the CSS and the router.

## Features

- **Three.js Animated Background:** A particle animation that responds to mouse movement.
- **Scroll-based Animations:** Elements fade in as the user scrolls down the page.
- **Mock Login System:** A simple login form that simulates authentication.
- **Futuristic UI:** A dark, cyberpunk-inspired design with glowing text and borders.
- **Bestiary Page:** A page that displays a list of entities from a JSON file, with search and filter functionality.

## Current Task: Add Bestiary Page

- Create `public/data/bestiary.json` to store the Bestiary data.
- Create `src/views/Bestiary.vue` and translate the HTML and JavaScript logic into it.
- Add `vue-router` to the project to handle the navigation between the `Home` and `Bestiary` pages.
- Update `App.vue` to use the router.
- Update `main.js` to install the router.
