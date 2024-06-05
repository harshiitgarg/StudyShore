import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import { useSelector } from "react-redux";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyProfile from "./components/Dashboard/MyProfile.jsx";
import PrivateRoute from "./components/core/Auth/PrivateRoute.jsx";
import Settings from "./components/Dashboard/Settings/index.jsx";
import OpenRoute from "./components/core/Auth/OpenRoute.jsx";
import { ACCOUNT_TYPE } from "./utils/constants.jsx";
import EnrolledCourse from "./components/Dashboard/EnrolledCourse.jsx";
import Cart from "./components/Dashboard/Cart/index.jsx";
import AddCourse from "./components/Dashboard/AddCourse/index.jsx";
import MyCourses from "./components/Dashboard/MyCourses.jsx";
import EditCourse from "./components/Dashboard/EditCourse/index.jsx";
import Catalog from "./pages/Catalog.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import ViewCourse from "./pages/ViewCourse.jsx";
import VideoDetails from "./components/ViewCourse/VideoDetails.jsx";

function App() {
  const { user } = useSelector((store) => store.profile);
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route
            path="/dashboard/my-profile"
            element={
              <PrivateRoute>
                <MyProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="/dashboard/enrolled-courses"
                element={<EnrolledCourse />}
              />
              <Route path="/dashboard/cart" element={<Cart />} />
            </>
          )}
          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              {/* <Route path="dashboard/instructor" element={<Instructor />} /> */}
              <Route path="dashboard/add-course" element={<AddCourse />} />
              <Route path="dashboard/my-courses" element={<MyCourses />} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        </Route>
        <Route path="/catalog/:catalogName" element={<Catalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />

        <Route
          element={
            <PrivateRoute>
              <ViewCourse />
            </PrivateRoute>
          }
        >
          <Route
            path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetails />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
