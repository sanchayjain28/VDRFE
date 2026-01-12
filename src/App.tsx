import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Login, Home, Project, ScopeDetails, ProjectDetails, CreateProject } from "./pages";
import { PATHS } from "./shared";
import { AppLayout } from "./layout";
import AuthLayout from "./layout/auth/AuthLayout";
import "./App.scss";


const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route element={<AuthLayout />}>
          <Route index path={PATHS.login} element={<Login />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route index path={PATHS.home} element={<Home />} />
          <Route path={PATHS.projects} element={<Project />} />
          <Route path={PATHS.scopeDetails} element={<ScopeDetails />} />
          <Route path={PATHS.projectDetails} element={<ProjectDetails />} />
          <Route path={PATHS.createProject} element={<CreateProject />} />
        </Route >
      </Route >
    )
  );

  return (
    <>
      <ToastContainer
        position={"bottom-right"}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeButton={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />

      <Suspense
        fallback={<div className="d-flex d-flex-middle d-flex-center h-full">Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
};

export default App;
