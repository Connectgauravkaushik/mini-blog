import { Feather } from "lucide-react";
import { Link } from "react-router";

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/60 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-800 text-white p-1.5 rounded-lg">
              <Feather size={20} />
            </div>
          <a
            href="#"
            className="text-2xl font-extrabold tracking-tight select-none"
          >
            Blogjar
          </a>

        </div>

        <div className="flex items-center gap-3">


          <Link to="/login" className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-sm hover:bg-slate-50">
            Sign in
          </Link>
          <Link to="/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white text-sm shadow-sm hover:shadow-md">
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
