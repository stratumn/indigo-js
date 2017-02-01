/*
    Stratumn Agent Javascript Library
    Copyright (C) 2016  Stratumn SAS

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

import getActionsInfo from '../src/getActionsInfo';

const actions = {
  init(a, b, c) { this.append({ a, b, c }); },
  action(d) { this.state.d = d; this.append(); }
};

describe('#getActionsInfo()', () => {
  it('returns the actions info', () => {
    getActionsInfo(actions).should.deepEqual({
      init: { args: ['a', 'b', 'c'] },
      action: { args: ['d'] }
    });
  });

  it('works when init is null', () => {
    const a = { action: actions.action };

    getActionsInfo(a).should.deepEqual({
      init: { args: [] },
      action: { args: ['d'] }
    });
  });
});