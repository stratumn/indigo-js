/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

// emulates Array.prototype.filter() with a filter that returns a promise
export default function filterAsync(array, filter) {
  return Promise.all(array.map(entry => filter(entry)))
    .then(bits => array.filter(() => bits.shift()));
}