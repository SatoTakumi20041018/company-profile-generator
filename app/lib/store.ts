"use client";

import { createContext, useContext } from "react";
import type { CompanyData } from "./types";
import { defaultCompanyData } from "./types";

export const CompanyDataContext = createContext<{
  data: CompanyData;
  setData: (data: CompanyData) => void;
}>({
  data: defaultCompanyData,
  setData: () => {},
});

export function useCompanyData() {
  return useContext(CompanyDataContext);
}
