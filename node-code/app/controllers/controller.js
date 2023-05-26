const db = require("../models");
const EmployeeData = db.employees;

// Create and Save a new
exports.create = (req, res) => {
  const employeeData = new EmployeeData({
    employee_name: req.body.name,
    departments: req.body.department,
    salary: req.body.salary
  });

  // Save employee data in the database
  employeeData
    .save(employeeData)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the data."
      });
    });
};

// Retrieve all data from the database.
exports.findAll = (req, res) => {
  EmployeeData.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    });
};

// Update a data by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  EmployeeData.findByIdAndUpdate(id, req.body)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update employee with id=${id}. Maybe demo was not found!`
        });
      } else res.send({ message: "employee was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating employee with id=" + id
      });
    });
};

// Delete a demo with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  EmployeeData.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete employee with id=${id}. Maybe demo was not found!`
        });
      } else {
        res.send({
          message: "employee was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete employee with id=" + id
      });
    });
};