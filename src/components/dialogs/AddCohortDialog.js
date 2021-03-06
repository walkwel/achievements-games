/**
 * @file AddCohortDialog container module
 * @author Theodor Shaytanov <theodor.shaytanov@gmail.com>
 * @created 22.02.18
 */
import React from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import {
  addCohortDialogHide,
  addCohortRequest
} from "../../containers/Cohorts/actions";

// RegExp rules
import {
  AddName,
  NoStartWhiteSpace
} from "../regexp-rules/RegExpRules";

class AddCohortDialog extends React.PureComponent {
  static propTypes = {
    cohort: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
  };

  state = {
    cohortName: "",
    cohortDescription: "",
    // cohort name cannot be nonsense or empty spaces
    isCorrectInput: false
  };

  onNameChange = e => {
    if (
      AddName.test(e.target.value) &&
      NoStartWhiteSpace.test(e.target.value)
    ) {
      this.setState({
        isCorrectInput: true,
        cohortName: e.target.value.trim()
      });
    } else {
      this.setState({
        isCorrectInput: false
      });
    }
  };

  onDescriptionChange = e => {
    const { cohort } = this.props;
    if (cohort && cohort.id) {
      this.setState({
        isCorrectInput: true
      });
    }
    this.setState({ cohortDescription: e.target.value });
  };

  resetState = () => {
    this.setState({
      cohortName: "",
      cohortDescription: "",
      isCorrectInput: false
    });
  };

  onClose = () => {
    this.resetState();
    this.props.dispatch(addCohortDialogHide());
  }

  onCommit = () => {
    this.props.dispatch(
      addCohortRequest({
        ...this.props.cohort,
        name: this.state.cohortName,
        description: this.state.cohortDescription
      })
    );
    // reset the disable of commit button
    this.resetState();
  };

  render() {
    const { open, cohort } = this.props;

    return (
      <Dialog onClose={this.onClose} open={open}>
        <DialogTitle>
          {cohort && cohort.id ? "Edit Cohort" : "Add Cohort"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            error={!this.state.isCorrectInput}
            helperText={this.state.isCorrectInput
              ? ""
              : "Name should not be empty or too long or have invalid characters"}
            defaultValue={cohort && cohort.name}
            label="Name"
            margin="dense"
            onChange={this.onNameChange}
            required
          />
          <TextField
            fullWidth
            defaultValue={cohort && cohort.description}
            label="Description"
            margin="dense"
            onChange={this.onDescriptionChange}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={this.onClose}>
            Cancel
          </Button>
          <Button
            disabled={
              !this.state.isCorrectInput
            }
            color="primary"
            onClick={this.onCommit}
            variant="raised"
          >
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default AddCohortDialog;
