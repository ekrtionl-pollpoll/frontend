import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./pages/Main";
import SignUpPage from "./pages/SignUp";
import SignInPage from "./pages/SignIn";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import ErrorPage from "./pages/ErrorPage";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/Profiles/Profile";
import VoteLayout from "./layouts/VoteLayout";
import VotePage from "./pages/Votes/Votes";
import VoteDetailPage from "./pages/Votes/VoteDetail";
import VoteTrending from "./pages/VoteTrending";
import ProfileLayout from "./layouts/ProfileLayout";
import BoardPage from "./pages/Boards/Boards";
import BoardDetailPage from "./pages/Boards/BoardDetail";
import CustomProfile from "./pages/CustomProfile";
import BoardCreatePage from "./pages/Boards/BoardCreate";
import VoteCreatePage from "./pages/Votes/VoteCreate";
import React from "react";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <MainPage />,
          index: true,
        },
        {
          path: "/boards",
          element: <BoardPage />,
        },
        {
          path: "/boards/create",
          element: <BoardCreatePage />,
        },
        {
          path: "/boards/:id",
          element: <BoardDetailPage />,
        },
        {
          path: "/custom-profile",
          element: <CustomProfile />,
        },
      ],
    },
    {
      path: "/votes",
      element: <VoteLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <VotePage />,
        },
        {
          path: "create",
          element: <VoteCreatePage />,
        },
        {
          path: ":id",
          element: <VoteDetailPage />,
        },
        {
          path: "trending",
          element: <VoteTrending />,
        },
      ],
    },
    {
      element: <AuthLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "signup",
          element: <SignUpPage />,
        },
        {
          path: "signin",
          element: <SignInPage />,
        },
      ],
    },

    {
      path: "/profile",
      errorElement: <ErrorPage />,
      element: (
        <ProtectedRoute>
          <ProfileLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <ProfilePage />,
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
