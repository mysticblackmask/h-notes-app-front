import React, { Suspense } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./pages/home/RootLayout";
import { ErrorPage } from "./pages/error/ErrorPage";
import { ProgressBar } from "./components/ui/Progressbar";
import HomePage from "./pages/home/HomePage";
import CreateLayout from "./pages/notes/CreatePage";
import NotesPage from "./pages/notes/NotesPage";
import TrashPage from "./pages/notes/TrashPage";
import DetailNoteLayout from "./pages/notes/DetailNotePage";
import FavouritePage from "./pages/notes/FavouritePage";
import LoginLayout from "./pages/auth/LoginPage";
import RegisterLayout from "./pages/auth/RegisterPage";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
        <Route index path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateLayout />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/:noteId" element={<DetailNoteLayout />} />
        <Route path="/trash" element={<TrashPage />} />
        <Route path="/favourite" element={<FavouritePage />} />
        <Route path="/register" element={<RegisterLayout />} />
        <Route path="/login" element={<LoginLayout />} />
      </Route>
    )
  );

  return (
    <Suspense fallback={<ProgressBar />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
