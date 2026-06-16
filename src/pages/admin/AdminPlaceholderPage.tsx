import { Header, Main } from "@components/index.ts";
import { adminStyles } from "./adminStyles.ts";

interface AdminPlaceholderPageProps {
  title: string;
}

export const AdminPlaceholderPage = ({ title }: AdminPlaceholderPageProps) => {
  return (
    <>
      <Header />
      <Main className="bg-gbh-cream px-6 py-10 md:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
          <p className={`${adminStyles.label} mb-2`}>Admin</p>
          <h1 className={`${adminStyles.heading} text-5xl md:text-6xl`}>
            {title}
          </h1>
          <div className={`${adminStyles.panel} p-8`}>
            <p className={adminStyles.bodyText}>Coming soon.</p>
          </div>
        </div>
      </Main>
    </>
  );
};
