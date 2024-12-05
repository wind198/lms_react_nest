import { useRoutes } from "react-router";
import { allRoutes } from "./routes/allRoutes";
import useSetupTitleAndBreadcrumbs from "@/lib/hooks/useSetTitles";

function App() {
  const routes = useRoutes(allRoutes);
  useSetupTitleAndBreadcrumbs();

  return <div id="app">{routes}</div>;
}

export default App;
