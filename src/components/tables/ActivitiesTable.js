/**
 * @file ActivitiesTable component module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Timeline from "@material-ui/icons/Timeline";

import DoneIcon from "@material-ui/icons/Done";
import withStyles from "@material-ui/core/styles/withStyles";
import AnalysisDialog from "../dialogs/AnalysisDialog";
import {
  PATH_STATUS_COLLABORATOR,
  PATH_STATUS_JOINED,
  PATH_STATUS_NOT_JOINED,
  PATH_STATUS_OWNER
} from "../../containers/Path/selectors";

import { ACTIVITY_TYPES } from "../../services/paths";

const COLUMN_ACTIONS_WIDTH = 240;

const styles = theme => ({
  link: {
    textDecoration: "none"
  },
  button: {
    margin: theme.spacing.unit
  },
  noWrap : {
    whiteSpace: 'nowrap'
  }
});

class ActivitiesTable extends React.PureComponent {
  static propTypes = {
    activities: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    currentUserId: PropTypes.string,
    onDeleteActivity: PropTypes.func.isRequired,
    onEditActivity: PropTypes.func.isRequired,
    onMoveActivity: PropTypes.func.isRequired,
    onOpenActivity: PropTypes.func.isRequired,
    pathStatus: PropTypes.oneOf([
      PATH_STATUS_OWNER,
      PATH_STATUS_COLLABORATOR,
      PATH_STATUS_JOINED,
      PATH_STATUS_NOT_JOINED
    ])
  };

  state = {
    activity: null,
    analysisDialog: {
      open: false,
      name : '',
      activityId: null
    }
  };

  openAnalysisDialog = (activityId, name) =>
    this.setState({ analysisDialog: { open: true, name, activityId } });

  handleCloseAnalysisDialog = () =>
    this.setState({ analysisDialog: { open: false, data: {} } });

  selectActivity = activity => this.setState({ activity });

  render() {
    const {
      activities,
      classes,
      onDeleteActivity,
      onEditActivity,
      onMoveActivity,
      onOpenActivity,
      pathStatus
    } = this.props;

    let minOrderIndex = Infinity;
    let maxOrderIndex = -Infinity;

    (activities || []).forEach(activity => {
      if (activity.orderIndex < minOrderIndex) {
        minOrderIndex = activity.orderIndex;
      }
      if (activity.orderIndex > maxOrderIndex) {
        maxOrderIndex = activity.orderIndex;
      }
    });

    const canChange = [PATH_STATUS_COLLABORATOR, PATH_STATUS_OWNER].includes(
      pathStatus
    );

    return (
      <Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activity name</TableCell>
              <TableCell>Description</TableCell>
              {!canChange && <TableCell>Status</TableCell>}
              <TableCell style={{ width: COLUMN_ACTIONS_WIDTH }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map(activity => (
              <TableRow key={activity.id}>
                <TableCell className={classes.noWrap}>{activity.name}</TableCell>
                <TableCell className={classes.noWrap}>{activity.description}</TableCell>
                {!canChange && (
                  <TableCell>
                    {activity.solved && (
                      <Icon>
                        <DoneIcon />
                      </Icon>
                    )}
                  </TableCell>
                )}
                <TableCell className={classes.noWrap} style={{ textAlign : 'right'}}>
                  {[ACTIVITY_TYPES.jupyter.id, ACTIVITY_TYPES.jupyterInline.id].includes(activity.type) && (

                    <Tooltip
                      title={"View Default Solution Analysis"}
                      PopperProps={
                        {
                          style: {
                            pointerEvents: 'none'
                          }
                        }
                      }
                    >
                      <Button
                        onClick={() =>
                          this.openAnalysisDialog(activity.id, activity.name)
                        }
                        variant="raised"
                        className={classes.button}
                      >
                        <Timeline />
                      </Button>
                    </Tooltip>

                  )}
                  <Button
                    onClick={() => onOpenActivity(activity)}
                    variant="raised"
                  >
                    Solve
                  </Button>
                  {canChange && (
                    <Button
                      className={classes.button}
                      id={activity.id}
                      onClick={() => this.selectActivity(activity)}
                      variant="raised"
                    >
                      More
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {canChange && (
          <Menu
            anchorEl={document.getElementById(
              this.state.activity && this.state.activity.id
            )}
            onClose={() => this.selectActivity()}
            open={!!this.state.activity}
          >
            <MenuItem
              className={classes.button}
              onClick={() =>
                this.selectActivity() || onEditActivity(this.state.activity)
              }
              variant="raised"
            >
              Edit
            </MenuItem>
            <MenuItem
              className={classes.button}
              onClick={() =>
                this.selectActivity() ||
                onDeleteActivity(this.state.activity.id)
              }
              variant="raised"
            >
              Delete
            </MenuItem>
            {this.state.activity &&
              this.state.activity.orderIndex !== minOrderIndex && (
                <MenuItem
                  className={classes.button}
                  onClick={() =>
                    this.selectActivity() ||
                    onMoveActivity(this.state.activity, "up")
                  }
                  variant="raised"
                >
                  Move Up
                </MenuItem>
              )}
            {this.state.activity &&
              this.state.activity.orderIndex !== maxOrderIndex && (
                <MenuItem
                  className={classes.button}
                  onClick={() =>
                    this.selectActivity() ||
                    onMoveActivity(this.state.activity, "down")
                  }
                  variant="raised"
                >
                  Move Down
                </MenuItem>
              )}
          </Menu>
        )}
        <AnalysisDialog
          handleClose={this.handleCloseAnalysisDialog}
          open={this.state.analysisDialog.open}
          name={this.state.analysisDialog.name}
          activityId={this.state.analysisDialog.activityId}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(ActivitiesTable);
