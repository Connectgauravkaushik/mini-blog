import { Feather } from "lucide-react";

 const Footer = () => (
  <footer className="mt-24 border-t border-t-gray-200 bg-white/80 ">
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div className="text-2xl font-extrabold flex">
          <div className="bg-emerald-800 text-white p-1.5 rounded-lg w-8">
            <Feather size={20} />
          </div>
          Blogjar
        </div>
        <p className="mt-3 text-sm text-slate-600">
          A magazine of design, travel and photo-essays. Crafted with care.
        </p>
      </div>

      <div className="md:col-span-2 grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold">Explore</h4>
          <ul className="mt-3 text-sm text-slate-700 space-y-2">
            <li>
              <a href="#">Articles</a>
            </li>
            <li>
              <a href="#">Topics</a>
            </li>
            <li>
              <a href="#">Resources</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Legal</h4>
          <ul className="mt-3 text-sm text-slate-700 space-y-2">
            <li>
              <a href="#">Privacy</a>
            </li>
            <li>
              <a href="#">Terms</a>
            </li>
            <li>
              <a href="#">Cookies</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="col-span-full text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Blogjar. All rights reserved.
      </div>
    </div>
  </footer>
);
export default Footer;