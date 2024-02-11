import { DependencyList, useEffect } from "react";
import { useLayoutContext } from "../context/layout";
import { Breadcrumbs } from "../components/BreadCrumbs";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export const useBreadcrumbs = (
  breadcrumbs: BreadcrumbItem[],
  dependencies: DependencyList
) => {
  const { updateBreadCrumbsContent } = useLayoutContext();
  useEffect(() => {
    updateBreadCrumbsContent(<Breadcrumbs items={breadcrumbs} />);
    return () => updateBreadCrumbsContent(null);
  }, dependencies);
};
