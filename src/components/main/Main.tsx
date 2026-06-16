import { FC, ReactNode } from "react";

export const Main: FC<{ children?: ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <main className={`flex-1 ${className || ""}`}>
      {children}
    </main>
  );
};
