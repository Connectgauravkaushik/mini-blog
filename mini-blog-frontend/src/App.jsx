// src/App.jsx
import "./App.css";
import { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
} from "react-router";
import Sidebar from "./components/DashboardComponent/Sidebar";
import Footer from "./pages/Footer/Footer";
import Header from "./pages/Header/Header";
import HeroSection from "./pages/HeroSection/HeroSection";
import BlogPost from "./pages/Blogcard/Blog";
import SettingsModal from "./components/DashboardComponent/settings";
import { useUserStore } from "./store/userStore";

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

function RequireAuth({ children }) {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  // If not authenticated, redirect to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // else render children (dashboard layout etc)
  return children;
}

function RedirectIfAuth({ children }) {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
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
          path: "blog/:id",
          element: (
            <Suspense fallback={null}>
              <BlogPost />
            </Suspense>
          ),
        },
      ],
    },

    // login (optional redirect when already authenticated)
    {
      path: "login",
      element: (
        <Suspense fallback={null}>
          <RedirectIfAuth>
            <Login />
          </RedirectIfAuth>
        </Suspense>
      ),
    },

    // Protected dashboard routes
    {
      path: "dashboard",
      element: (
        <RequireAuth>
          <DashboardLayout />
        </RequireAuth>
      ),
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

    {
      path: "blog-support",
      element: (
        <Suspense fallback={null}>
          <AiSupportAgent />
        </Suspense>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
