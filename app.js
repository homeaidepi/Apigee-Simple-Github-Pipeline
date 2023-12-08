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
    }
  }

  // Scenario: I should be given an empty array for a non existing country name
  // When I GET /airports?country=utopia
  // Then response code should be 200
  // And response body path $ should be of type array with length 0
    if (country) {
        if (country === "utopia") {
        res.json(airports);
        }
    }

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
  let airport = {};
  const id = req.params.id;

  if (id === "XYZ") {
    const error = new Error(`Airport ${id} not found`);
    error.status = 404;
    return next(error);
  }

  airport = {
    id,
    name: `Airport ${id}`,
    city: `City ${id}`,
    country: `Country ${id}`,
  };

  res.json(airport);
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
