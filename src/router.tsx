import { RootRoute, Route, Router } from "@tanstack/react-router";
import App from "./App";
import ScanView from "./features/scan/ScanView";

const rootRoute = new RootRoute({
  component: App,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ScanView,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = new Router({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
