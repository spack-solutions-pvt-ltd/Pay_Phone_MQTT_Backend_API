const swaggerJsDoc = require('swagger-jsdoc');

const manufacturerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API Documentation Manufacturer',
            version: '1.0.0',
            description: 'Production-ready API docs Manufacturer',
        },
        servers: [
            {
                url: 'http://localhost:5000/v1/manufacturer',
            },
        ],
    },
    apis: ["./src/routes/Manufacturer/*.js",]
};


const distributorOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API Documentation Distributor',
            version: '1.0.0',
            description: 'Production-ready API docs Distributor',
        },
        servers: [
            {
                url: 'http://localhost:5000/v1/distributor',
            },
        ],
    },
    apis: ["./src/routes/Distributor/*.js",]
};

const operatorOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API Documentation Operator',
            version: '1.0.0',
            description: 'Production-ready API docs Operator',
        },
        servers: [
            {
                url: 'http://localhost:5000/v1/operator',
            },
        ],
    },
    apis: ["./src/routes/Operator/*.js",]
};

const manufacturerSwaggerSpec = swaggerJsDoc(manufacturerOptions);
const distributorSwaggerSpec = swaggerJsDoc(distributorOptions);
const operatorSwaggerSpec = swaggerJsDoc(operatorOptions);

module.exports = {
    manufacturerSwaggerSpec,
    distributorSwaggerSpec,
    operatorSwaggerSpec
};