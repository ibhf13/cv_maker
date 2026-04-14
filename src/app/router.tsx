import { createBrowserRouter } from "react-router"
import { LandingPage } from "@/pages/landing-page"
import { EditorPage } from "@/pages/editor-page"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/editor",
    element: <EditorPage />,
  },
  {
    path: "/pro",
    element: <EditorPage />,
  },
])
