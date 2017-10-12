import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { TopBar, LeftDrawer } from './';

export const App = ({ processes, children }) => (
  <MuiThemeProvider>
    <div>
      <TopBar />
      <LeftDrawer processes={processes} />
      {children}
    </div>
  </MuiThemeProvider>
);

function mapStateToProps(state) {
  console.log('mapStateToProps', state);
  let processes = [];
  if (state.agentInfo) {
    processes = Object.keys(state.agentInfo.processes);
  }
  return { processes };
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  processes: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default withRouter(connect(mapStateToProps)(App));
