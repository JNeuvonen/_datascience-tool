import React, { createContext, ReactNode, useContext, useState } from "react";

interface LayoutContextType {
  titleBarHeight: number;
  sideBarWidth: number;
  pageTabsheight: number;
  setSideBarWidth: React.Dispatch<React.SetStateAction<number>>;
  setPageTabsHeight: React.Dispatch<React.SetStateAction<number>>;
  titleBarContent: JSX.Element | null;
  sideBarContent: JSX.Element | null;
  breadCrumbsContent: JSX.Element | null;
  updateTitleBarContent: (element: JSX.Element | null) => void;
  updateSideBarContent: (element: JSX.Element | null) => void;
  updateBreadCrumbsContent: (element: JSX.Element | null) => void;
}

export const LayoutContext = createContext<LayoutContextType>(
  {} as LayoutContextType
);

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [titleBarHeight] = useState(45);
  const [sideBarWidth, setSideBarWidth] = useState(0);
  const [pageTabsheight, setPageTabsHeight] = useState(0);
  const [titleBarContent, setTitleBarContent] = useState<JSX.Element | null>(
    null
  );
  const [sideBarContent, setSideBarContent] = useState<JSX.Element | null>(
    null
  );
  const [breadCrumbsContent, setBreadCrumbsContent] =
    useState<JSX.Element | null>(null);

  const updateTitleBarContent = (element: JSX.Element | null) => {
    setTitleBarContent(element);
  };

  const updateSideBarContent = (element: JSX.Element | null) => {
    setSideBarContent(element);
  };

  const updateBreadCrumbsContent = (element: JSX.Element | null) => {
    setBreadCrumbsContent(element);
  };

  return (
    <LayoutContext.Provider
      value={{
        titleBarHeight,
        titleBarContent,
        updateTitleBarContent,
        updateSideBarContent,
        sideBarWidth,
        setSideBarWidth,
        sideBarContent,
        pageTabsheight,
        setPageTabsHeight,
        updateBreadCrumbsContent,
        breadCrumbsContent,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => useContext(LayoutContext);
