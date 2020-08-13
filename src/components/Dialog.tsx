import React from "react";
import { DialogExtensionSDK } from "contentful-ui-extensions-sdk";
import GqlPlayground from "./GqlPlayground";

interface DialogProps {
  sdk: DialogExtensionSDK;
}

const Dialog = (props: DialogProps) => {
  const { sdk } = props;
  const { parameters } = sdk;

  // @ts-ignore
  const entry = parameters?.invocation?.entry;
  // @ts-ignore
  const cpaToken = parameters?.installation?.cpaToken;

  const spaceId = sdk.ids.space;

  sdk.window.updateHeight(800);
  document.addEventListener("keydown", (event) => {
    if (event.keyCode === 27) {
      sdk.close();
    }
  });

  console.log(entry);

  return (
    <>
      <GqlPlayground {...{ entry, cpaToken, spaceId }} />;
    </>
  );
};

export default Dialog;
