import { ReactElement, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerAppContent,
  DrawerContent,
  DrawerHeader,
  DrawerSubtitle,
  DrawerTitle,
  List,
  ListItem,
} from "rmwc";

type PageProps = {
  children: ReactElement;
};

const pages = [
  { title: "Accounts", path: "/accounts" },
  { title: "Transactions Log", path: "/transactions" },
  { title: "Current Rates", path: "/rates" },
];

const Page = ({ children }: PageProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/accounts");
    }
  }, [location, navigate]);

  return (
    <div className="layout">
      <Drawer>
        <DrawerHeader>
          <DrawerTitle>Funds Transfers</DrawerTitle>
          <DrawerSubtitle>Test Application</DrawerSubtitle>
        </DrawerHeader>
        <DrawerContent>
          <List>
            {pages.map((page) => (
              <ListItem
                key={page.path}
                tag={Link}
                to={page.path}
                activated={location.pathname === page.path}
              >
                {page.title}
              </ListItem>
            ))}
          </List>
        </DrawerContent>
      </Drawer>
      <DrawerAppContent>
        <Outlet />
      </DrawerAppContent>
    </div>
  );
};

export default Page;
