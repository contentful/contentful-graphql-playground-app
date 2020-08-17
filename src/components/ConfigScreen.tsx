import React, { Component, ChangeEvent } from "react";
import { AppExtensionSDK } from "contentful-ui-extensions-sdk";
import {
  Card,
  TextField,
  Heading,
  Form,
  TextLink,
  Paragraph,
  Note,
} from "@contentful/forma-36-react-components";
import logo from "../assets/logo.png";

export interface AppInstallationParameters {
  cpaToken: string;
}

type ParameterKeys = keyof AppInstallationParameters;

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  parameters: AppInstallationParameters;
}

export default class Config extends Component<ConfigProps, ConfigState> {
  sdk: AppExtensionSDK;

  constructor(props: ConfigProps) {
    super(props);
    this.state = { parameters: { cpaToken: "" } };
    this.sdk = props.sdk;

    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    props.sdk.app.onConfigure(() => this.onConfigure());
  }

  async componentDidMount() {
    // Get current parameters of the app.
    // If the app is not installed yet, `parameters` will be `null`.
    const parameters: AppInstallationParameters | null = await this.props.sdk.app.getParameters();

    this.setState(parameters ? { parameters } : this.state, () => {
      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      this.props.sdk.app.setReady();
    });
  }

  onConfigure = async () => {
    const currentAppState = await this.sdk.app.getCurrentState();

    if (!this.state.parameters.cpaToken) {
      this.sdk.notifier.error("Please define the Content Preview API token.");
      return false;
    }

    return {
      parameters: this.state.parameters,
      targetState: {
        EditorInterface: {
          ...currentAppState.EditorInterface,
        },
      },
    };
  };

  onInputChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;

    this.setState({
      parameters: {
        [name as ParameterKeys]: value,
      },
    });
  };

  render() {
    return (
      <Card style={{ maxWidth: "30em", margin: "3em auto" }}>
        <img
          src={logo}
          alt="GraphlQL Playground Logo"
          style={{ height: "5em", margin: "0 0 2em", display: "block" }}
        />
        <Form>
          <Heading>GraphQL Playground Config</Heading>
          <Paragraph>
            <TextLink
              href={`https://app.contentful.com/spaces/${this.sdk.ids.space}/api/keys`}
              target="_blank"
              rel="noopener"
            >
              Create a new pair of API keys
            </TextLink>{" "}
            and save the Content Preview API token below:
          </Paragraph>
          <Note>
            The CPA (Content Preview API) token allows you to also access
            preview data when using GraphQL playground.
          </Note>
          <TextField
            name="cpaToken"
            id="cpaToken"
            labelText="CPA token"
            required
            value={this.state.parameters.cpaToken}
            onChange={this.onInputChange}
          />
        </Form>
      </Card>
    );
  }
}
