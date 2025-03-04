import { Helmet } from "react-helmet";

const Meta = ({ title }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title || "Kosmos Solution"}</title>
      <link rel="apple-touch-icon" href="/favicon.png" />
      <link rel="icon" href="favicon.png" />
    </Helmet>
  );
};

export default Meta;
