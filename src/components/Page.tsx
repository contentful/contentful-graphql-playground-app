import React from "react";
import { PageExtensionSDK } from "contentful-ui-extensions-sdk";
import GqlPlayground from "./GqlPlayground";

interface PageProps {
  sdk: PageExtensionSDK;
}

const Page = (props: PageProps) => {
  const { sdk } = props;
  const { parameters } = sdk;
  // @ts-ignore
  const cpaToken = parameters?.installation?.cpaToken;
  const spaceId = sdk.ids.space;

  return <GqlPlayground {...{ cpaToken, spaceId }} />;
};

export default Page;
