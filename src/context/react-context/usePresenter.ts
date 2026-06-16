import { useContext, useRef } from "react";
import { AppContext } from "./AppContext.tsx";
import type { Context } from "../Context.ts";

export const usePresenter = <TPresenter>(
  createPresenter: (context: Context) => TPresenter,
): TPresenter => {
  const context = useContext(AppContext);
  const presenterRef = useRef<TPresenter | null>(null);
  const contextRef = useRef<Context | null>(null);

  if (!presenterRef.current || contextRef.current !== context) {
    presenterRef.current = createPresenter(context);
    contextRef.current = context;
  }

  return presenterRef.current;
};
