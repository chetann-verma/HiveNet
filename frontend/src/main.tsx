import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { Login } from './features/authentication/pages/Login/Login';
import { Signup } from './features/authentication/pages/Signup/Signup';
import { Resetpassword } from './features/authentication/pages/ResetPassword/Resetpassword';
import { VerifyEmail } from './features/authentication/pages/VerifyEmail/VerifyEmail';
;
import { AuthenticationContextProvider } from './features/authentication/contexts/AuthenticationContextProvider';
import { AuthenticationLayout } from './features/authentication/components/AuthenticationLayout/AuthenticationLayout';
import { ApplicationLayout } from './components/ApplicationLayout/ApplicationLayout';
import { Feed } from './features/feed/pages/Feed/Feed';
import { Profile } from './features/authentication/pages/Profile/Profile';

const router = createBrowserRouter([
  {
    //to wrap all pages
    element: <AuthenticationContextProvider/>,
//create this for other pages too
    children: [
      {//these children are rendered thru this layout
        path: "/",
        element: <ApplicationLayout/>,
        children: [
          {
            index: true,
            element: <Feed/>,
          },
          {
            path: "network",
            element: <div>Network</div>,
          },
          {
            path: "jobs",
            element: <div>Jobs</div>,
          },
          {
            path: "messaging",
            element: <div>Messaging</div>,
          },
          {
            path: "notifications",
            element: <div>Notifications</div>,
          },
          {
            path: "profile/:id",
            element: <Profile/>,
          },
          {
            path: "settings",
            element: <div>Settings & Privacy</div>,
          },
        ],
      },

      {//for auth pages only
        path: "/authentication",
        //addressing all tha url started with it will be renered with this layout
        //authentication/login this is relative pass so it takes from above / oheriwse it is absolute
        element: <AuthenticationLayout/>,
        children: [
  {
    path: "login",
    element: <Login/>,
  },
  {
    path: "signup",
    element: <Signup/>,
  },
  {
    path: "request-password-reset",
    element: <Resetpassword/>,
  },
  {
    path: "verify-email",
    element: <VerifyEmail/>,
  },
  {
    path: "profile/:id",
    element: <Profile/>,
  },
        ],
      },
      {
        //anything not match to above pages redirect to this
        path: "*",
        element: <Navigate to="/"/>,
      },
    ],
  },
  
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
