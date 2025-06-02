import React, { useEffect, useState } from "react";

export default function UserManage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetch("/src/data/data.json")
      .then(res => res.json())
      .then(data => {
        setUsers(data.Users || []);
        const roleMap = {};
        (data.Roles || []).forEach(r => {
          roleMap[r.id] = r.name;
        });
        setRoles(roleMap);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-blue-900">User Account Management</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-900">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white">No.</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white">Username</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white">Full Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white">Role</th>
              <th className="px-4 py-2 text-center text-xs font-semibold text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="hover:bg-blue-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.full_name}</td>
                  <td className="px-4 py-2">{roles[user.role_id] || "No role assigned"}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => setSelectedUser(user)}
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                      onClick={() => alert("Edit function is under development")}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleDelete(user.id)}
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

      {/* Modal for user details */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div><b>Username:</b> {selectedUser.username}</div>
            <div><b>Full Name:</b> {selectedUser.full_name}</div>
            <div><b>Email:</b> {selectedUser.email}</div>
            <div><b>Phone:</b> {selectedUser.phonenumber}</div>
            <div><b>Address:</b> {selectedUser.address}</div>
            <div><b>Date of Birth:</b> {selectedUser.date_of_birth}</div>
            <div><b>Gender:</b> {selectedUser.gender === "M" ? "Male" : selectedUser.gender === "F" ? "Female" : "Other"}</div>
            <div><b>Role:</b> {roles[selectedUser.role_id] || selectedUser.role_id}</div>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}