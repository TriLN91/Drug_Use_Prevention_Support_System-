import React, { useEffect, useState } from "react";

export default function CourseManage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("/src/data/data.json")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.Courses || []);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((course) => course.id !== id));
      // Real deletion requires backend API call
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Course Management</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-900">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white">No.</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white">Course Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white">Description</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white">Start Date</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white">End Date</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white">Type</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white">Target Age Group</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No courses available
                </td>
              </tr>
            ) : (
              courses.map((course, index) => (
                <tr key={course.id} className="hover:bg-blue-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{course.name}</td>
                  <td className="px-4 py-2">{course.description}</td>
                  <td className="px-4 py-2">{course.start_date}</td>
                  <td className="px-4 py-2">{course.end_date}</td>
                  <td className="px-4 py-2">{course.type}</td>
                  <td className="px-4 py-2">{course.target_age_group}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => alert(JSON.stringify(course, null, 2))}
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                      onClick={() => alert("Edit functionality coming soon")}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleDelete(course.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}