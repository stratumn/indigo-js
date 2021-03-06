/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import express from 'express';
import Agent from '@stratumn/agent';

import messageBoard from './lib/actions-message';
import warehouseTracker from './lib/actions-warehouse';

const {
  httpServer,
  plugins,
  storeHttpClient,
  storeClientFactory,
  fossilizerClientFactory,
  fossilizerHttpClient,
  websocketServer
} = Agent;

// Create an HTTP store client to save segments.
// Assumes an HTTP store server is available on env.STRATUMN_STORE_URL or http://store:5000.
const storeClient = storeClientFactory.create(
  storeHttpClient,
  process.env.STRATUMN_STORE_URL || 'http://store:5000'
);

const fossilizerHttpClients = [];
// Create HTTP fossilizer clients to fossilize segments.
// You need to provide a comma-separated list of fossilizer urls in the env.STRATUMN_FOSSILIZERS_URLS.
if (process.env.STRATUMN_FOSSILIZERS_URLS) {
  const urls = process.env.STRATUMN_FOSSILIZERS_URLS.split(',');
  for (let i = 0; i < urls.length; i += 1) {
    fossilizerHttpClients.push(
      fossilizerClientFactory.create(fossilizerHttpClient, urls[i])
    );
  }
}

// Create an agent.
const agentUrl = process.env.STRATUMN_AGENT_URL || 'http://localhost:3000';
const agent = Agent.create({
  agentUrl: agentUrl
});

// Adds all processes from a name, its actions, the store client, and the fossilizer client.
// As many processes as one needs can be added.
// A different storeHttpClient and fossilizerHttpClient may be used.
agent.addProcess('message', messageBoard, storeClient, fossilizerHttpClients, {
  // plugins you want to use
  plugins: [plugins.agentUrl(agentUrl), plugins.stateHash]
});

agent.addProcess(
  'warehouse',
  warehouseTracker,
  storeHttpClient,
  fossilizerHttpClients,
  {
    // plugins you want to use
    plugins: [plugins.agentUrl(agentUrl), plugins.stateHash]
  }
);

// Creates an HTTP server for the agent with CORS enabled.
const agentHttpServer = httpServer(agent, { cors: {} });

// Create the Express server.
const app = express();

app.disable('x-powered-by');

// Mount agent on the root path of the server.
app.use('/', agentHttpServer);

// Create server by binding app and websocket connection
const server = websocketServer(app, storeHttpClient);

// Start the server.
server.listen(3000, () => {
  console.log(`Listening on ${agentUrl}`);
});
