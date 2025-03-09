import { Navigate, Route, Routes } from "react-router-dom";
import loadable from "./utils/loadable";
import { useDispatch, useSelector } from "react-redux";
import { userTypes } from "./utils/constants";
import { useEffect } from "react";
import { getUser } from "./services/auth";
import { setUser } from "./redux/slices/CommonSlice";

const appRoutes = [
  {
    path: "/",
    component: () => <Navigate replace to={"/dashboard"} />,
    isProtected: true,
    userType: userTypes.ADMIN,
    props: {}
  },
  {
    path: "/dashboard",
    component: loadable(() => import("./pages/DashboardPage")),
    isProtected: true,
    userType: userTypes.ADMIN,
    props: {}
  },
  {
    path: "/login",
    component: loadable(() => import("./pages/LoginPage")),
    isProtected: false,
    props: {}
  },
  {
    path: "/dashboard/merchant",
    component: loadable(() => import("./pages/MerchantList")),
    isProtected: true,
    userType: userTypes.ADMIN,
    props: {}
  },
  {
    path: "/merchant/transactions",
    component: loadable(() => import("./pages/MerchantReadonly")),
    isProtected: true,
    userType: userTypes.MERCHANT,
    props: {}
  },
  {
    path: "/merchant/login",
    component: loadable(() => import("./pages/MerchantLogin")),
    isProtected: false,
    props: {}
  },
  {
    path: "/dashboard/transaction/deposit",
    component: loadable(() => import("./pages/Payment")),
    isProtected: true,
    userType: userTypes.ADMIN,
    props: { transactionType: "deposit" }
  },
  {
    path: "/dashboard/transaction/payout",
    component: loadable(() => import("./pages/Payment")),
    isProtected: true,
    userType: userTypes.ADMIN,
    props: { transactionType: "cashout" }
  },
  {
    path: "/generate-signature",
    component: loadable(() => import("./pages/GenerateSignature")),
    props: {}
  },
  {
    path: "/excel-report",
    component: loadable(() => import("./pages/ReportsPage")),
    isProtected: true,
    props: {}
  },
  {
    path: "/*",
    component: loadable(() => import("./pages/NotFoundPage")),
    isProtected: true,
    props: {}
  }
];

const AppRoutes = () => {
  const { isLoggedIn, user } = useSelector((state) => state.common);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      getUser().then((res) => {
        if (res.data?.responseData?.email) {
          dispatch(setUser(res.data.responseData));
        }
      });
    }
  }, [dispatch, isLoggedIn]);


  return (
    <Routes>
      {appRoutes.map((route, index) => {
        let ComponentRender = route.component;
        if (!isLoggedIn && route.isProtected) {
          ComponentRender = () => <Navigate replace to={"/login"} />;
        } else if (isLoggedIn && route.userType === userTypes.ADMIN && user.type !== userTypes.ADMIN) {
          ComponentRender = () => <Navigate replace to={"/merchant/transactions"} />;
        } else if (
          isLoggedIn &&
          user.type === userTypes.ADMIN &&
          (route.path === "/login" || route.path === "/merchant/login")
        ) {
          ComponentRender = () => <Navigate replace to={"/dashboard"} />;
        } else if (
          isLoggedIn &&
          user.type === userTypes.MERCHANT &&
          (route.path === "/login" || route.path === "/merchant/login")
        ) {
          ComponentRender = () => <Navigate replace to={"/merchant/transactions"} />;
        }
        return <Route key={route.path + index} path={route.path} element={<ComponentRender {...route.props} />} />;
      })}
    </Routes>
  );
};

export default AppRoutes;
