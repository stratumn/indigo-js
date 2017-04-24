/*
    Copyright (C) 2017  Stratumn SAS

    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/**
 * Returns information about an agent's plugins.
 * @param {array} plugins - the plugin list
 * @returns {object} information about the plugins
 */
export default function getPluginsInfo(plugins) {
  return plugins.map(plugin => (
    {
      name: plugin.name,
      description: plugin.description
    })
  );
}