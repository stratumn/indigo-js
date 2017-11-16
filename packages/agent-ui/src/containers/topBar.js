import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, NavLink, Route } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import layout from '../styles/layout';

import { TopBarButton } from '../components';
import { openCreateMapDialog, openAppendSegmentDialog } from '../actions';

const renderTopBarLinks = path => {
  if (!path || path === '/') {
    return (
      <Typography type="title" noWrap>
        Welcome to the Indigo Framework UI
      </Typography>
    );
  }

  const parts = path.split('/').filter(p => p);
  let currentLink = '';
  return parts.map(p => {
    currentLink += `/${p}`;
    return (
      <Typography type="title" key={p}>
        {'/'}
        <NavLink key={p} to={currentLink}>
          {p}
        </NavLink>
      </Typography>
    );
  });
};

export const TopBar = ({ path, mapDialog, segmentDialog, classes }) => (
  <AppBar className={classes.appBar}>
    <Toolbar>
      {renderTopBarLinks(path)}
      <Route
        exact
        path="/:agent/:process/maps"
        render={props => (
          <TopBarButton
            text="Create"
            openDialog={mapDialog}
            {...props.match.params}
          />
        )}
      />
      <Route
        exact
        path="/:agent/:process/maps/:id"
        render={props => (
          <TopBarButton
            text="Append"
            openDialog={segmentDialog}
            {...props.match.params}
          />
        )}
      />
    </Toolbar>
  </AppBar>
);

TopBar.propTypes = {
  path: PropTypes.string.isRequired,
  mapDialog: PropTypes.func.isRequired,
  segmentDialog: PropTypes.func.isRequired,
  /* eslint-disable react/forbid-prop-types */
  match: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
  classes: PropTypes.shape({
    appBar: PropTypes.string.isRequired
  }).isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    path: ownProps.location.pathname
  };
}

export default withStyles(layout)(
  withRouter(
    connect(mapStateToProps, {
      mapDialog: openCreateMapDialog,
      segmentDialog: openAppendSegmentDialog
    })(TopBar)
  )
);
