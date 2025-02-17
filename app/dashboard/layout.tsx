import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-switcher";
import { DynamicBreadcrumbs } from "@/components/dynamic-breadcrumbs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative h-svh">
        <header className="absolute top-0 w-full z-[100] bg-white dark:bg-jjBlack flex h-16 shrink-0 border-b-[1px] border-black/[0.1] dark:border-white/[0.1] items-center justify-between pr-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumbs />
          </div>
          <ThemeToggle className="" />
        </header>
        <div className="h-full flex flex-1 flex-col gap-4 p-4 z-0 relative pt-20">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
