import { FC, ReactNode } from "react";

export const Main: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <main className="min-h-[70vh] p-5 text-center text-gbh-black">
      {children}
    </main>
  );
};
