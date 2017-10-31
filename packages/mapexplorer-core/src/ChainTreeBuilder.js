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

import { getAgent } from 'stratumn-agent-client';
import ChainTree from './ChainTree';
import compactHash from './compactHash';
import resolveLinks from './resolveLinks';
import wrap from './wrap';
import parseIfJson from './parseIfJson';
import tagsSet from './tagsSet';

function load(map) {
  return getAgent(map.agentUrl)
    .then(agent => {
      const process = agent.processes[map.process];
      return process.findSegments({ mapIds: [map.id], limit: -1 });
    })
    .catch(res => console.log(res));
}

export const defaultOptions = {
  withArgs: false,
  duration: 750,
  verticalSpacing: 1.4,
  polygonSize: { width: 78, height: 91 },
  titleHeight: 50,
  extraNodesLayoutColor: 'lightcoral',
  mainTreeLayoutColor: 'lightblue',
  getBoxSize() {
    const self = this;
    return { width: self.polygonSize.width, height: 25 };
  },
  getArrowLength() {
    return this.polygonSize.width;
  },
  getSegmentText(node) {
    return compactHash(node.data.meta.linkHash);
  },
  getRefLinkText(node) {
    return `go to map ${compactHash(node.data.link.meta.mapId)}`;
  },
  getLinkText(link) {
    if (link.ref) {
      return 'reference';
    }
    return (
      link.target.data.link.meta.action +
      (this.withArgs
        ? `(${link.target.data.link.meta.arguments.join(', ')})`
        : '')
    );
  },
  onclick() {
    console.log('hello');
  },
  onTag() {}
};

export default class ChainTreeBuilder {
  constructor(element) {
    this.chainTree = new ChainTree(element);
  }

  build(map, options) {
    this.onTag = options.onTag;
    const optionsWithAgent = Object.assign(options, {
      agentUrl: map.agentUrl
    });
    if (map.id && map.agentUrl && map.process) {
      return load(map).then(segments =>
        this.display(segments, optionsWithAgent)
      );
    } else if (map.chainscript && map.chainscript.length) {
      try {
        return resolveLinks(wrap(parseIfJson(map.chainscript))).then(segments =>
          this.display(segments, optionsWithAgent)
        );
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.resolve();
  }

  display(segments, options) {
    this.chainTree.display(
      segments,
      Object.assign({}, defaultOptions, options)
    );
    this.notifyTags(segments);
    return segments;
  }

  notifyTags(chainscript) {
    tagsSet(chainscript).forEach(this.onTag);
  }
}
