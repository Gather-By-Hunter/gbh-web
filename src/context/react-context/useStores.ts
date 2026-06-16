import { useContext } from "react";
import { AppContext } from "./AppContext.tsx";
import type { Stores } from "../Context.ts";

export const useStores = (): Stores => useContext(AppContext).stores;
