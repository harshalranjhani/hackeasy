import Signin from "@/components/Login/Auth/Signin";
import Signup from "@/components/Login/Auth/Signup";
import Head from "next/head";
import AuthNav from "@/components/Login/Auth/AuthNav/AuthNav";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Provider, useSelector } from "react-redux"; // Import Provider and useSelector
import store from "@/utils/store"; // Import your Redux store
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { uiActions } from "@/utils/store/ui-slice";

const LoginPage = ({ error }) => {
  // for auth errors
  if (error) {
    toast.error(error + ": Please try again with another auth provider.");
  }

  const [queryData, setQueryData] = useState(null);
  const [requestedUrl, setRequestedUrl] = useState(null);
  const dispatch = useDispatch();
  let isSignUp = useSelector((state) => state.ui.isSignUp);
  const router = useRouter();

  useEffect(() => {
    const query = router.query;
    if (query.email) {
      setQueryData(query);
    }
  }, []);

  useEffect(() => {
    const query = router.query;
    if (query.requestedUrl) {
      setRequestedUrl(query.requestedUrl);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="HackEasy Login - Sign In/Sign Up" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthNav queryData={queryData} />
      {isSignUp || queryData ? (
        <Signup queryData={queryData} />
      ) : (
        <Signin queryData={queryData} requestedUrl={requestedUrl} />
      )}
    </>
  );
};

const Login = ({ error }) => (
  <Provider store={store}>
    <LoginPage error={error} />
  </Provider>
);

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: true,
      },
    };
  }

  const error = context.query.error;
  console.log(error);
  return {
    props: {
      data: null,
      error: error ? error : null,
    },
  };
}

export default Login;
