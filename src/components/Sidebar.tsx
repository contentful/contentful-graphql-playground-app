import React from "react";
import { Paragraph, Button } from "@contentful/forma-36-react-components";
import { SidebarExtensionSDK } from "contentful-ui-extensions-sdk";

interface SidebarProps {
  sdk: SidebarExtensionSDK;
}

const Sidebar = (props: SidebarProps) => {
  const { sdk } = props;
  sdk.window.startAutoResizer();
  const openGQLPlayground = () =>
    sdk.dialogs.openCurrentApp({
      width: "fullWidth",
      minHeight: "800px",
      shouldCloseOnOverlayClick: true,
      shouldCloseOnEscapePress: true,
      parameters: {
        entry: sdk.entry.getSys(),
      },
    });

  return (
    <Paragraph>
      <Button onClick={openGQLPlayground} style={{ width: "100%" }}>
        Open GQL Playground
      </Button>
    </Paragraph>
  );
};

export default Sidebar;
