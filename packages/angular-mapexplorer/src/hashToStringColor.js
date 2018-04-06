/*
  Copyright 2018 Stratumn SAS. All rights reserved.

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

function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    /* eslint-disable */
    hash = (hash << 5) + hash + str.charCodeAt(i); /* hash * 33 + c */
    /* eslint-enable */
  }
  return hash;
}

export default function hashStringToColor(str) {
  const hash = djb2(str);
  /* eslint-disable */
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  /* eslint-enable */
  return `#${`0${r.toString(16)}`.substr(-2) +
    `0${g.toString(16)}`.substr(-2) +
    `0${b.toString(16)}`.substr(-2)}`;
}
