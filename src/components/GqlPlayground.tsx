import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import {
  Playground,
  store,
  GraphQLEditor,
  getResponses,
  getQuery,
} from 'graphql-playground-react';
import stripIndent from 'strip-indent';
import { Note } from '@contentful/forma-36-react-components';

interface Sys {
  id: String;
}

interface ContentType {
  sys: Sys;
}

interface Entry {
  id: string;
  contentType: ContentType;
}

interface GqlPlaygroundProps {
  cpaToken: string;
  spaceId: string;
  spaceEnvironment: string;
  spaceEnvironmentAlias: string | undefined;
  entry?: Entry;
}

function formatQuery(query: string) {
  return stripIndent(query)
    .split('\n')
    .filter((line) => !!line)
    .join('\n');
}

function GqlPlayground(props: GqlPlaygroundProps) {
  const {
    cpaToken,
    entry,
    spaceId,
    spaceEnvironment,
    spaceEnvironmentAlias,
  } = props;

  const [hasCollection, setHasCollection] = useState<boolean>();

  const tabConfig = {
    endpoint: `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${
      spaceEnvironmentAlias || spaceEnvironment
    }`,
    headers: {
      Authorization: `Bearer ${cpaToken}`,
    },
  };

  const tabs = entry
    ? [
        {
          ...tabConfig,
          name: `${entry.contentType.sys.id}`,
          query: formatQuery(`
            query ${entry.contentType.sys.id}EntryQuery {
              ${entry.contentType.sys.id}(id: "${entry.id}") {
                sys {
                  id
                }
                # add the fields you want to query
              }
            }`),
        },
        {
          ...tabConfig,
          name: `${entry.contentType.sys.id}Collection`,
          query: formatQuery(`
            query ${entry.contentType.sys.id}CollectionQuery {
              ${entry.contentType.sys.id}Collection {
                items {
                  sys {
                    id
                  }
                  # add the fields you want to query
                }
              }
            }`),
        },
      ]
    : [
        {
          ...tabConfig,
          name: `Query`,
          query: formatQuery(`
            query {
              # add your query
            }`),
        },
      ];

  const settings = { 'editor.theme': 'light' };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const query: string = getQuery(store.getState());
      const response = getResponses(store.getState());
      console.log(response);
      const result = query.toLowerCase().includes('collection');
      if (hasCollection !== result) {
        setHasCollection(result);
      }
    });
    return unsubscribe;
  }, [hasCollection]);

  return (
    <>
      {hasCollection && (
        <Note>
          Did you know that the default limit for a collection is <b>100</b>,
          lowering this would decrease your query complexity! [
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.contentful.com/developers/docs/references/graphql/#/reference/collection-fields/arguments:~:text=default%20is%200-,limit,to%20fetch.%20The%20default%20is%20100%20and%20the%20maximum%20is%201000,-where"
          >
            source
          </a>
          ]
        </Note>
      )}
      <Provider store={store}>
        <Playground
          tabs={tabs}
          settings={settings}
          fixedEndpoint={true}
          {...tabConfig}
        >
          <GraphQLEditor onRef={console.log} />
        </Playground>
      </Provider>
    </>
  );
}

export default GqlPlayground;
