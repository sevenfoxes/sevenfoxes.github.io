import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchJobs } from '../../actions/NavigationActions'

class ContentContainer extends Component {
  componentWillMount() {
    this.props.getJobs()
  }
  render() {
    console.log(this.props.jobs)
    return (
      <div>
        {JSON.stringify(this.props.jobs)}
      </div>
    )
  }
};
export default connect(state => ({
  jobs: state.jobs,
}), dispatch => ({
  getJobs: () => dispatch(fetchJobs())
}))(ContentContainer)
