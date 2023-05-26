module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        employee_name: String,
        departments : String,
        salary : Number
      },
      { timestamps: true }
    );
  
    const Employees = mongoose.model("employee-list", schema);
    return Employees;
  };