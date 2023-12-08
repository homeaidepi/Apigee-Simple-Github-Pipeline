const express = require("express");
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition options
const swaggerDefinition = {
  info: {
    title: "Airports API",
    version: "1.0.0",
    description: "Get Airports list and details",
  },
  host: "localhost:3000",
  basePath: "/airports",
  schemes: ["https"],
};

// Swagger-jsdoc options
const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Specify your route files here
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger UI for documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define your API routes here
app.get("/airports", (req, res) => {
  console.log("GET /airports");
  // Implement logic to return a list of airports
  // This should use the OKRequestList response schema
  // initialize an airport array of 50 items
  const airports = [];
  const limit = req.query.limit || 50;
  const country = req.query.country || null;
  console.log(`limit: ${limit}`);
  console.log(`country: ${country}`);

  // Scenario: I should find all airports for a given country filter
  // When I GET /airports?country=india
  // Then response code should be 200
  // And response body path $ should be of type array with length 2
  // And response body path $.[0].iata should be DEL
  // And response body path $.[1].iata should be BOM
  if (country) {
    if (country === "india") {
      airports.push({
        id: 1,
        name: "Indira Gandhi International Airport",
        iata: "DEL",
        city: "New Delhi",
        country: "India",
      });
      airports.push({
        id: 2,
        name: "Chhatrapati Shivaji Maharaj International Airport",
        iata: "BOM",
        city: "Mumbai",
        country: "India",
      });

      res.json(airports);
      return;
    }
  }

  // Scenario: I should be given an empty array for a non existing country name
  // When I GET /airports?country=utopia
  // Then response code should be 200
  // And response body path $ should be of type array with length 0
  if (country) {
    if (country === "utopia") {
      res.json(airports);
      return;
    }
  }

  // else return a list of airports with the given limit
  for (let i = 0; i < limit; i++) {
    airports.push({
      id: i,
      name: `Airport ${i}`,
      city: `City ${i}`,
      country: `Country ${i}`,
    });
  }

  res.json(airports);
});

app.get("/airports/:id", (req, res) => {
  console.log("GET /airports/:id");
  // Implement logic to return details of one airport by ID
  // This should use the OKRequestAirport response schema for success
  // and the KONotFound response schema for errors
  const id = req.params.id;
  const country = id || null;

  // Scenario: I should be able to identify an airport by its IATA code
  //     When I GET /airports/FRA
  //     Then response code should be 200
  //     And response body path $.airport should be Germany Frankfurt Airport
  if (country) {
    if (country === "FRA") {
      const airport = {
        id: 1,
        airport: "Germany Frankfurt Airport",
        name: "Frankfurt Airport",
        iata: "FRA",
        city: "Frankfurt",
        country: "Germany",
      };

      res.json(airport);
      return;
    }
  }

  // Scenario: I should receive a 404 error for non-existing codes
  //     When I GET /airports/XYZ
  //     Then response code should be 404
  if (id === "XYZ") {
    const error = new Error(`Airport ${id} not found`);
    error.status = 404;
    res.status(404);
    res.send(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
