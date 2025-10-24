import * as React from "react";

export type SimpleEditorLayoutContextValue = {
  isDesktop: boolean;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const SimpleEditorLayoutContext = React.createContext<SimpleEditorLayoutContextValue | undefined>(undefined);

export const useSimpleEditorLayoutContext = () => React.useContext(SimpleEditorLayoutContext);

export const SimpleEditorLayoutProvider = SimpleEditorLayoutContext.Provider;
