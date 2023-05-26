module.exports = app => {
    const employeeData = require("../controllers/controller.js");
  
    var router = require("express").Router();
  
    // Create a new Employee
    router.post("/", employeeData.create);
  
    // Retrieve all employees
    router.get("/", employeeData.findAll);
  
    // Update a Tutorial with id
    router.put("/:id", employeeData.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", employeeData.delete);
  
    app.use("/api/employees", router);
  };