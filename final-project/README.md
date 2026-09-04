# ABUJA MARKETS: CROWD-SOURCED COMMODITY PRICE AND VENDOR TRACKER

#### Video Demo:  [https://youtu.be/GiBFjcOLYbo](https://youtu.be/GiBFjcOLYbo)

#### Description:
**Abuja Markets** is a crowd-sourced full-stack web application developed as a final project for CS50x 2026. The platform serves as a decentralized commodity pricing and vendor tracking index tailored specifically for residents and local businesses in Abuja, Nigeria. Due to macroeconomic factors, fuel price fluctuations, and supply chain constraints, commodity costs across major territorial hubs—such as Wuse Market, Utako Market, Garki Market, Mararaba Market, and Bwari Market—experience highly unpredictable changes daily. This pricing opacity leaves everyday consumers vulnerable to price gouging, forces vendors to manually track competitors by travelling long distances, and complicates budget planning for families.

This software solves this problem by providing a centralized, transparent dashboard where consumers, traders, and agricultural brokers can submit localized price data. By compiling multi-source entries for staple food items and essential goods (categorized into Grains, Tubers, Vegetables, Oils, Livestock, and others), the application dynamically calculates real-time average prices per unit of measurement (such as Mudus, Paint Buckets, or Bags). Furthermore, it logs specific retail stalls and vendor landmarks within these physical markets, bridging the gap between digital asset monitoring and real-world brick-and-mortar trading layouts.

### Technical Architecture & Design Choices
The application is built using a decoupled **MERN Stack** (MongoDB, Express.js, React.js, and Node.js) architecture. This approach represents a deliberate pedagogical transition from the Python, Flask, and SQL environments used in the CS50x curriculum to JavaScript-centric enterprise web patterns. 

During the initial scoping phase, a relational model like PostgreSQL or SQLite was considered. However, a non-relational Document Object Model (NoSQL via MongoDB Atlas) was ultimately selected due to the unstructured data patterns of open-air marketplaces. Individual vendors frequently shift their operations or lack standardized shop identifiers, meaning our data model required a flexible schema capable of appending variable arrays of historical logs without demanding structural schema migrations.

On the frontend, **Vite** was utilized instead of traditional compilation tools because of its Hot Module Replacement (HMR) speeds, ensuring a smooth developer experience. For the styling framework, a clean, system-native programmatic CSS layout was deployed to guarantee fast load times, minimizing data usage for users visiting the site on mobile networks across Abuja.

---

### Project Directory Structure & Component Breakdown

The project workspace is cleanly separated into autonomous architectural modules:

```text
final-project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── Product.js
│   ├── routes/
│   │   └── productRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── .gitignore
```

#### 📁 backend/
*   **`server.js`**: The foundational gatekeeper of our REST API. It handles environment configurations via `dotenv`, sets up global JSON request parsing middleware, enables Cross-Origin Resource Sharing (`cors`) to connect with our React frontend, and mounts our endpoint pathways cleanly.
*   **`config/db.js`**: Controls the asynchronous connection pool to our remote **MongoDB Atlas Cloud Cluster**. It includes a `try-catch` exception handling routine to handle socket time-outs gracefully, printing clean connection states straight to the systems monitor.
*   **`models/Product.js`**: Defines the data schema rules for our commodities using Mongoose. It uses an embedded object array schema to track history lines, appending individual prices, markets, vendor fields, and reporter aliases. Crucially, it deploys a Mongoose **Virtual Field (`averagePrice`)** to dynamically calculate the mean price on the fly whenever a product document is requested, omitting the need to consume unnecessary database writes.
*   **`routes/productRoutes.js`**: Maps the HTTP network commands to database controller triggers. The `GET` endpoint fetches the full market inventory and maps it in alphabetical order. The `POST` endpoint evaluates payload bodies; if an item name does not exist, it creates a new product catalog profile, and if it does exist, it pushes a historical entry to its tracking history array.

#### 📁 frontend/
*   **`src/App.jsx`**: The core operational layout of our user interface. Built with modular state hooks (`useState`, `useEffect`), it initiates network calls to our port via the `axios` client module package upon loading. The layout uses a responsive column configuration: a tracking form on the left pane with dropdown selectors restricted to Abuja's main operational markets, and a real-time live index grid on the right pane rendering pricing calculations and chronological vendor updates.
*   **`src/main.jsx`**: Mounts our React workspace node onto the primary DOM element, anchoring our single-page application setup.

---

### AI Attributions & Citation
In compliance with the CS50x Academic Honesty Policy for the final project, AI assistive technologies were used to help build this software. Specifically, an AI agent assisted with configuring the localized Node Version Manager (NVM) binary parameters to bypass broken APT package mirror conflicts inside the Kali Linux host machine. It also helped write the boilerplate structure for the backend REST routes and compile the dynamic object arrays used inside the MERN controller pipelines. All code optimizations and architectural logic adjustments were manually reviewed and validated.
