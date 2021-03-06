import { indigo } from 'material-ui/colors';

const drawerWidth = 240;

export default (/* theme */) => ({
  root: {
    width: '100%',
    height: '100%'
  },
  appFrame: {
    position: 'absolute',
    display: 'flex',
    width: 'calc(100% - 8px)'
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth
  },
  drawerPaper: {
    height: '100%',
    width: drawerWidth,
    backgroundColor: indigo[800]
  },
  content: {
    width: '100%',
    height: 'calc(100% - 56px)',
    marginTop: 56,
    marginLeft: drawerWidth - 10
  }
});
