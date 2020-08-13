import React, { Component, ChangeEvent } from "react";
import { AppExtensionSDK } from "contentful-ui-extensions-sdk";
import {
  TextField,
  Heading,
  Form,
  Workbench,
  Paragraph,
} from "@contentful/forma-36-react-components";
import { css } from "emotion";

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
      <Workbench className={css({ margin: "80px" })}>
        <Form>
          <Heading>GraphQL Playground Config</Heading>
          <Paragraph>
            Please define your Content Preview API (CPA) token here
          </Paragraph>
          <TextField
            name="cpaToken"
            id="cpaToken"
            labelText="CPA token"
            required
            value={this.state.parameters.cpaToken}
            onChange={this.onInputChange}
          />
        </Form>
      </Workbench>
    );
  }
}
