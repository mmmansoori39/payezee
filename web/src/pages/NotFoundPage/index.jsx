import NotFound from "../../components/NotFound";

export default function NotFoundPage() {
  return (
    <NotFound
      errorCode="404"
      title={"Page Not Found"}
      description={"The page you're looking for does not seem to exist"}
      ctaTitle={"Go to Home"}
      ctaPath="/"
    />
  );
}
