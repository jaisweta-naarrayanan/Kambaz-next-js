"use client";
import { ReactNode, use } from "react";
import KambazNavigation from "./Navigation";

import "./styles.css";
import store from "./store";
import { Provider } from "react-redux";

export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
   <Provider store={store}>
     <div className="d-flex" id="wd-kambaz">
       <div>
         <KambazNavigation />
       </div>
       <div className="flex-fill ps-3 wd-main-content-offset">{children}</div>
     </div>
   </Provider>
);
}

