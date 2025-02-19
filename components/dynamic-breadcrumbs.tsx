"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

export function DynamicBreadcrumbs() {
  const pathname = usePathname();

  // Remove any trailing slash (except if it's the root "/")
  const cleanedPath =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;

  // Split the path into segments (ignoring empty segments)
  const segments = cleanedPath.split("/").filter(Boolean);

  // Build an array of breadcrumb objects for each segment.
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    // Optionally, you can format the segment (e.g. capitalize it)
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, href };
  });

  // If there are no segments (i.e. at the home page), show a "Home" breadcrumb.
  if (breadcrumbs.length === 0) {
    breadcrumbs.push({ label: "Home", href: "/" });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          // For example, you might want the first breadcrumb hidden on mobile (as before)
          const className = index === 0 ? "hidden md:block" : "";
          return (
            <Fragment key={crumb.href}>
              <BreadcrumbItem className={className}>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  </>
                )}
              </BreadcrumbItem>
              {index !== breadcrumbs.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
