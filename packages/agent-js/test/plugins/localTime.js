/*
    Stratumn Agent Javascript Library
    Copyright (C) 2017  Stratumn SAS

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import pluginTest from '.';
import localTime from '../../src/plugins/localTime';

function test(segment) {
  segment.link.meta.localTime.should.be.a.Number();
}

pluginTest(localTime, {
  '#createMap()'(segment) {
    test(segment);
  },

  '#createSegment()'(segment) {
    test(segment);
  },

  '#action()'(link) {
    return (link.meta.localTime === null).should.be.true;
  }
});

