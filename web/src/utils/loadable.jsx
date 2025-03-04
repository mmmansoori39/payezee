import { lazy, Suspense } from "react";
import Spinner from "../components/Spinner";

const loadable = (importFunc, options = { fallback: <Spinner /> }) => {
  const LazyComponent = lazy(importFunc);

  return (props) => (
    <Suspense fallback={options.fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default loadable;
