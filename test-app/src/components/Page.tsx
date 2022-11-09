import { useEffect, useState } from "react";
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
  Tab,
  TabBar,
} from "rmwc";

const pages = [
  { title: "Accounts", path: "/accounts" },
  { title: "Transactions Log", short: "Transactions", path: "/transactions" },
  { title: "Current Rates", short: "Rates", path: "/rates" },
];

const Page = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/accounts");
    } else {
      const tabIndex = pages.findIndex(
        (page) => location.pathname.indexOf(page.path) === 0
      );
      if (tabIndex !== activeTab) {
        switchTab(tabIndex);
      }
    }
  }, [location, navigate]);

  const [activeTab, setActiveTab] = useState(0);
  const switchTab = (index: number) => {
    setActiveTab(index);
  };

  useEffect(() => {
    if (
      pages[activeTab] &&
      location.pathname.indexOf(pages[activeTab].path) === -1
    ) {
      navigate(pages[activeTab].path);
    }
  }, [activeTab]);

  return (
    <div className="layout">
      <TabBar
        activeTabIndex={activeTab}
        onActivate={(evt) => switchTab(evt.detail.index)}
        className="layout--tabs"
      >
        {pages.map((page) => (
          <Tab key={page.path}>{page.short || page.title}</Tab>
        ))}
      </TabBar>
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
                activated={location.pathname.indexOf(page.path) === 0}
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
