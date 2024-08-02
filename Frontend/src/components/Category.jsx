import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Category() {
  const [category, setCategory] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/category")
      .then((result) => {
        setCategory(result.data.categories);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Category List</h3>
      </div>
      <Link to="/dashboard/add_category" className="btn btn-success">
        Add Category
      </Link>
      <div className="mt-3">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {category.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Category;
