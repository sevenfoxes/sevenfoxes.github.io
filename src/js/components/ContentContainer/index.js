/**
 * @flow
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchJobs } from '../../actions/NavigationActions'


class ContentContainer extends Component {
  componentWillMount() {
    this.props.getJobs()
  }

  listJobs(jobList) {
    return this.props.jobs.map((job: Object, i: Number) => {
      return <div key={i}>{job.name}</div>
    })
  }

  render() {
    return (
      <div>
        <h1>People</h1>
        <div>
          {this.listJobs()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  jobs: state.jobs
})

const mapDispatchToProps = (dispatch: Function) => ({
  getJobs: () => dispatch(fetchJobs())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)
