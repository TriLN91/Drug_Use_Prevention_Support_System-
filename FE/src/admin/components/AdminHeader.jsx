export default function AdminHeader() {
  return (
    <header className="admin-header flex justify-between items-center px-6 py-4 bg-white shadow">
      <span className="font-bold text-lg">Drug Use Prevention - ADMIN PANEL</span>
      <span className="flex items-center gap-3">
        <span>Hello, Admin User</span>
        <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded">
          Logout
        </button>
      </span>
    </header>
  );
}