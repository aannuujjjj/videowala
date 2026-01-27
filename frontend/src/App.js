import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./components/common/ProtectedRoutes";

/* Auth Pages */
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

/* Dashboard */
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const MyVideos = lazy(() => import("./pages/dashboard/MyVideos"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const AllVideos = lazy(() => import("./pages/dashboard/AllVideos"));

/* Public */
const Contact = lazy(() => import("./pages/Contact"));


/* Fallback */
const NotFound = () => <h2 style={{ textAlign: "center" }}>404 | Page Not Found</h2>;

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ textAlign: "center" }}>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="my-videos" element={<MyVideos />} />
              <Route path="profile" element={<Profile />} />
              <Route path="all-videos" element={<AllVideos />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
