import express from "express";
import db from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const router = express.Router();

//Router for Login Form
router.post("/employeelogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM employee WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      const passwordsMatch = await bcrypt.compare(
        password,
        storedHashedPassword
      );
      if (passwordsMatch) {
        const token = jwt.sign(
          { role: "employee", email: user.email, id: user.id },
          '96890562-12c1-4e95-8122-f9f59c568c91',
          { expiresIn: "1d" }
        );

        // Set JWT token as a cookie
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 3600000,
          secure: true,
        });

        // Send success response
        return res
          .status(200)
          .json({ loginStatus: true, message: "You are logged in", id: user.id }); // Access the user's ID property
      } else {
        // Send response for incorrect password
        return res
          .status(401)
          .json({ loginStatus: false, error: "Incorrect Email or Password" });
      }
    } else {
      // Send response for user not found
      return res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    // Send response for internal server error
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/detail/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const getEmployee = await db.query("SELECT * FROM employee WHERE id = $1", [id]);
    res.json({ success: true, Result: getEmployee.rows });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.json({ success: false, message: "Failed to fetch employee" });
  }
})


router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  return res.json({ Status: true })
})


// Route to check if employee is currently clocked in
router.get("/employee_is_clocked_in/:id", async (req, res) => {
  const { id } = req.params; // Extract employee ID from URL parameters

  try {
    // Check if there is a clock-in record without a corresponding clock-out time
    const result = await db.query(
      "SELECT * FROM clock_records WHERE employee_id = $1 AND clock_out IS NULL",
      [id]
    );

    // Send success response with clock-in status
    return res.status(200).json({ clockedIn: result.rows.length > 0 });
  } catch (error) {
    console.error("Error while checking clock-in status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// Route to handle employee clock-in
router.post("/employee_clockin/:id", async (req, res) => {
  const { id } = req.params; // Extract employee ID from URL parameters
  const { location, work_from_type } = req.body;

  try {
    // Insert clock-in record into the database
    await db.query(
      "INSERT INTO clock_records (employee_id, clock_in, location, work_from_type) VALUES ($1, NOW(), $2, $3)",
      [id, location, work_from_type]
    );

    // Send success response
    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error while clocking in:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
});

// Route to handle employee clock-out
router.post("/employee_clockout/:id", async (req, res) => {
  const { id } = req.params; // Extract employee ID from URL parameters

  try {
    // Update the clock-out time for the employee
    await db.query(
      "UPDATE clock_records SET clock_out = NOW() WHERE employee_id = $1 AND clock_out IS NULL",
      [id]
    );

    // Send success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error while clocking out:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});


// Route to fetch calendar data for a specific employee
router.get("/calendar/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Fetch clock records for the employee from the database
    const result = await db.query("SELECT * FROM clock_records WHERE employee_id = $1", [employeeId]);

    // Process the result and format the data as needed
    const calendarData = result.rows.map(row => {
      // Extract date from timestamp and format it as 'YYYY-MM-DD'
      const date = row.clock_in.toISOString().slice(0, 10);
      // Get day name from the date
      const dayName = new Date(row.clock_in).toLocaleDateString('en-US', { weekday: 'long' });

      return {
        date: date,
        dayName: dayName,
        clockIn: row.clock_in,
        clockOut: row.clock_out,
        location: row.location,
        workFromType: row.work_from_type
      };
    });

    // Send success response with formatted calendar data
    res.status(200).json({ success: true, calendarData });
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Define a route to get category by ID
router.get("/category/:id", async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await db.query("SELECT * FROM category WHERE id = $1", [categoryId]);

    if (category.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }
    res.status(200).json({ success: true, category: category.rows[0] });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// Route to get office location data
router.get("/office_location", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM office_locations");
    res.status(200).json({ success: true, officeLocations: result.rows });
  } catch (error) {
    console.error("Error fetching office locations:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Route to add a new office location
router.post("/office_location", async (req, res) => {
  const { name, latitude, longitude, address } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO office_locations (name, latitude, longitude, address) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, latitude, longitude, address]
    );

    res.status(201).json({ success: true, officeLocation: result.rows[0] });
  } catch (error) {
    console.error("Error adding office location:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Route to delete an office location by ID
router.delete("/office_location/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await db.query("DELETE FROM office_locations WHERE id = $1", [id]);
    res.status(200).json({ success: true, message: "Office location deleted successfully" });
  } catch (error) {
    console.error("Error deleting office location:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// add leave
router.post('/add_leave_record/:employee_id', async (req, res) => {
  const { employee_id } = req.params;
  const { start_date, end_date, leave_type, description } = req.body;

  try {
    const result = await db.query("INSERT INTO leave_records (employee_id, leave_start_date, leave_end_date, leave_type, description, status, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [employee_id, start_date, end_date, leave_type, description, 0, true]);
    res.status(201).json({ success: true, leaveRecord: result.rows[0] });
  } catch (error) {
    console.error("Error adding leave record:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
})

// get leave data by emp id
router.get('/get_leave_record/:employee_id', async (req, res) => {
  const { employee_id } = req.params;
  try {
    const result = await db.query("SELECT * FROM leave_records WHERE employee_id = $1", [employee_id]);
    res.status(200).json({ success: true, leaveRecord: result.rows[0] });
  } catch (error) {
    console.error("Error adding leave record:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
})


// get total leave data by emp id 

const calculateLeaveDaysPerMonthAndTypes = (records) => {
  const leaveDaysPerMonth = {};
  const leaveTypes = {};
  let totalLeaves = 0;

  records.forEach(record => {
    const startDate = new Date(record.leave_start_date);
    const endDate = new Date(record.leave_end_date);
    const leaveType = record.leave_type;

    if (!leaveTypes[leaveType]) {
      leaveTypes[leaveType] = 0;
    }

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      leaveDaysPerMonth[yearMonth] = (leaveDaysPerMonth[yearMonth] || 0) + 1;
      leaveTypes[leaveType] += 1;
      totalLeaves++;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return { leaveDaysPerMonth, leaveTypes, totalLeaves };
};

router.get('/get_total_leave/:employee_id', async (req, res) => {
  const { employee_id } = req.params;

  try {
    const result = await db.query("SELECT * FROM leave_records WHERE employee_id = $1 AND is_active = true AND status = 1", [employee_id]);
    const leaveRecords = result.rows;

    const { leaveDaysPerMonth, leaveTypes, totalLeaves } = calculateLeaveDaysPerMonthAndTypes(leaveRecords);

    res.status(200).json({
      success: true,
      data: {
        leaveDaysPerMonth,
        totalLeaves,
        leaveTypes
      },
      message: `Leave record for employee ID ${employee_id} retrieved successfully.`
    });
  } catch (error) {
    console.error("Error fetching leave record:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// get all emp leave data
router.get('/all_leave_record', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT leave_records.*, employee.name AS employee_name
      FROM leave_records
      JOIN employee ON leave_records.employee_id = employee.id
    `);
    res.status(200).json({ success: true, leaveRecord: result.rows });
  } catch (error) {
    console.error("Error fetching leave records:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// update status to approve
router.post('/update_leave_status/:leave_id', async (req, res) => {
  const { leave_id } = req.params;
  const { status } = req.body;
  if (status !== 1) {
    return res.status(400).json({ success: false, error: "Invalid status code." });
  }
  try {
    await db.query("UPDATE leave_records SET status = $1 WHERE id = $2", [status, leave_id]);
    res.status(200).json({ success: true, message: "Leave status updated successfully", });
  } catch (error) {
    console.error("Error adding leave record:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
})

// reject leave
router.post('/delete_leave_record/:leave_id', async (req, res) => {
  const { leave_id } = req.params;
  const { status } = req.body;
  if (status !== 2) {
    return res.status(400).json({ success: false, error: "Invalid status code." });
  }
  try {
    await db.query("UPDATE leave_records SET is_active = $1, status = $2 WHERE id = $3", [false, status, leave_id]);
    res.status(200).json({ success: true, message: "Leave record deleted successfully" });
  } catch (error) {
    console.error("Error deleting leave record:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
})



export { router as employeeRouter };
