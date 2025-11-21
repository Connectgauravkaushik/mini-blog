import { AlignLeft, LayoutGrid, PenTool, Settings, Bot } from "lucide-react";
import { NavLink } from "react-router";
import { useUserStore } from "../../store/userStore";

const Sidebar = () => {
  const setSettingsModal = useUserStore((s) => s.setSettingsModal);

  const baseItem =
    "flex flex-col items-center gap-1 w-full mt-2 transition-colors duration-200 ease-out";
  const iconBox =
    "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 ease-out transform";
  const label =
    "text-[10px] font-medium transition-colors duration-200 ease-out text-gray-500";

  return (
    <aside className="w-[70px] h-screen bg-[#1C1C1C] flex flex-col items-center py-6 shadow-xl">
      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          `${baseItem} ${
            isActive ? "text-white" : "text-gray-400 hover:text-white"
          }`
        }
      >
        <div className={`${iconBox} bg-emerald-600 shadow-lg`}>
          <AlignLeft size={20} />
        </div>
        <span className="text-[10px] font-medium text-gray-300">Home</span>
      </NavLink>

      <div className="flex flex-col gap-6 mt-10 w-full items-center">
        <NavLink
          to="/dashboard/create-blog"
          className={({ isActive }) =>
            `${baseItem} ${
              isActive ? "text-white" : "text-gray-400 hover:text-white"
            }`
          }
        >
          <div className={`${iconBox} hover:bg-white/10`}>
            <PenTool size={20} />
          </div>
          <span className={label}>Create</span>
        </NavLink>

        <NavLink
          to="/dashboard/manage-blog"
          className={({ isActive }) =>
            `${baseItem} ${
              isActive ? "text-white" : "text-gray-400 hover:text-white"
            }`
          }
        >
          <div className={`${iconBox} hover:bg-white/10`}>
            <LayoutGrid size={20} />
          </div>
          <span className={label}>Manage</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setSettingsModal(true)}
          className={`${baseItem} text-gray-400 hover:text-white focus:outline-none`}
          aria-label="Open settings"
        >
          <div className={`${iconBox} hover:bg-white/10`}>
            <Settings size={20} />
          </div>
          <span className={label}>Settings</span>
        </button>

        <NavLink
          to="/dashboard/support"
          className={({ isActive }) =>
            `${baseItem} ${
              isActive ? "text-white" : "text-gray-400 hover:text-white"
            }`
          }
        >
          <div
            className={`${iconBox}`}
            style={{
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.04), rgba(59,130,246,0.04))",
            }}
          >
            <div className="w-6 h-6 flex items-center justify-center text-emerald-300">
              <Bot size={18} />
            </div>
          </div>
          <span className={label}>Support</span>
        </NavLink>
      </div>

      <div className="mt-auto mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 border-2 border-[#1C1C1C] ring-1 ring-gray-700"></div>
      </div>
    </aside>
  );
};

export default Sidebar;
