import React, { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router";
import Loadable from "../layouts/full/shared/loadable/Loadable";
const FullLayout = Loadable(lazy(() => import("../layouts/full/FullLayout")));

import BlankLayout from "../layouts/blank/BlankLayout";
import ChatMain from "../views/dashboard/Chat/ChatMain";
const NotFoundPage = Loadable(lazy(() => import("../views/NotFoundPage")));

const Router = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboards/chat" /> },
      { path: "/dashboards/chat", exact: true, element: <ChatMain /> },
    ],
  },
  {
    path: "/",
    element: <BlankLayout />,
    children: [{ path: "*", element: <NotFoundPage /> }],
  },
];

const router = createBrowserRouter(Router);

export default router;
