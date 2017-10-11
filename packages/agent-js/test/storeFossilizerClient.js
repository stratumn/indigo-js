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

import request from 'superagent';
import mocker from 'superagent-mocker';
import create from '../src/create';
import fossilizerHttpClient from '../src/fossilizerHttpClient';
import mockFossilizerHttpServer from './utils/mockFossilizerHttpServer';
import memoryStore from '../src/memoryStore';

const actions = {
  init(a, b, c) {
    this.append({ a, b, c });
  }
};

const fossilizerClient = fossilizerHttpClient('http://localhost');
const agent = create({ agentUrl: 'http://localhost:3000' });
const process = agent.addProcess(
  'basic',
  actions,
  memoryStore(),
  fossilizerClient,
  {
    salt: ''
  }
);

mockFossilizerHttpServer(mocker(request), process);

describe('FossilizerHttpClient', () => {
  describe('#getInfo()', () => {
    it('resolves with the fossilizer info', () =>
      fossilizerHttpClient('http://localhost')
        .getInfo()
        .then(body => body.should.deepEqual({ name: 'mock' })));
  });

  describe('#fossilize()', () => {
    it('resolves with the response', () =>
      fossilizerClient
        .fossilize('Hello, World!', 'http://localhost:3333')
        .then(body =>
          body.should.deepEqual({
            data: 'Hello, World!',
            callbackUrl: 'http://localhost:3333'
          })
        ));
  });
});
