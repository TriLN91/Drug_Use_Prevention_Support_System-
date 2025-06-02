import { Link, useLocation } from "react-router-dom";
const menu = [
  { label: "Dashboard", path: "/admin", icon: "🏠" },
  { label: "User Accounts", path: "/admin/users", icon: "👤" },
  { label: "Courses", path: "/admin/courses", icon: "📚" },
  { label: "Surveys", path: "/admin/surveys", icon: "📊" },
  { label: "Schedule", path: "/admin/schedules", icon: "📆" },
  { label: "Programs", path: "/admin/programs", icon: "📝" },
  { label: "Consultants", path: "/admin/consultants", icon: "👔" },
  { label: "Reports", path: "/admin/reports", icon: "📈" },
  { label: "Content", path: "/admin/content", icon: "📰" },
  { label: "System Logs", path: "/admin/logs", icon: "🛡️" },
  { label: "Organization", path: "/admin/org", icon: "🏢" },
  { label: "User Profiles", path: "/admin/profiles", icon: "📋" }
];
export default function AdminSidebar() {
  const location = useLocation();
  return (
    <nav className="admin-sidebar">
      <div className="admin-logo">DRUG USE ADMIN</div>
      <ul>
        {menu.map(m => (
          <li key={m.path} className={location.pathname === m.path ? "active" : ""}>
            <Link to={m.path}><span>{m.icon}</span> {m.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}