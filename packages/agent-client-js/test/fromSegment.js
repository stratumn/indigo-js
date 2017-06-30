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

import fs from 'fs';
import { join } from 'path';
import fromSegment from '../src/fromSegment';
import agentHttpServer from './utils/agentHttpServer';

describe('#fromSegment', () => {

  let closeServer;
  beforeEach(() => agentHttpServer(3333).then(c => { closeServer = c; }));
  afterEach(() => closeServer());

  const raw = JSON.parse(fs.readFileSync(join(__dirname, './fixtures/segment.json')));

  it('loads a segment', () =>
    fromSegment(raw)
      .then(({ agent, segment }) => {
        agent.findSegments.should.be.a.Function();
        segment.link.should.deepEqual(raw.link);
      })
  );

});
