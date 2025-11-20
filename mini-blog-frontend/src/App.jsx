import "./App.css";
import { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Sidebar from "./components/DashboardComponent/Sidebar";
import Footer from "./pages/Footer/Footer";
import Header from "./pages/Header/Header";
import HeroSection from "./pages/HeroSection/HeroSection";
import BlogPost from "./pages/Blogcard/Blog";
import SettingsModal from "./components/DashboardComponent/settings";

const Login = lazy(() => import("./components/AuthComponent/Login"));

const Dashboard = lazy(() =>
  import("./components/DashboardComponent/Dashboard")
);
const CreateBlog = lazy(() =>
  import("./components/DashboardComponent/CreateBlog")
);
const ManageBlogs = lazy(() =>
  import("./components/DashboardComponent/manageBlog")
);

const AiSupportAgent = lazy(() =>
  import("./components/SupportAgentComp/support")
);

function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

function DashboardLayout() {
  return (
    <>
      <div className="flex">
        <aside className="dashboard-sidebar" aria-label="Main navigation">
          <Sidebar />
        </aside>

        <main className="w-full" id="main-content" tabIndex="-1">
          {/* This Outlet will render Dashboard, ManageBlogs, CreateBlog, etc */}
          <div className="dashboard-content-inner">
            <Outlet />
          </div>
        </main>
        <SettingsModal />
      </div>
    </>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={null}>
              <HeroSection />
            </Suspense>
          ),
        },
        {
          path: "blog",
          element: (
            <Suspense fallback={null}>
              <BlogPost />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "login",
      element: (
        <Suspense fallback={null}>
          <Login />
        </Suspense>
      ),
    },

    {
      path: "dashboard",
      element: <DashboardLayout />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={null}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: "manage-blog",
          element: (
            <Suspense fallback={null}>
              <ManageBlogs />
            </Suspense>
          ),
        },
        {
          path: "create-blog",
          element: (
            <Suspense fallback={null}>
              <CreateBlog />
            </Suspense>
          ),
        },
        {
          path: "support",
          element: (
            <Suspense fallback={null}>
              <AiSupportAgent />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
