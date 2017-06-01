import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchJobs } from '../../actions/NavigationActions'
import styled from 'styled-components'

const Jobs = styled.ul`
  padding: 0;
  margin: 0;
`

const Job = styled.li`
  background: #999;
  color: white;
  list-style-type: none;
  margin-bottom: 1rem;
  padding: 1rem;
`


class ContentContainer extends Component {
  componentWillMount() {
    this.props.getJobs()
  }

  listJobs(jobList) {
    return this.props.jobs.map((job, i) => {
      return <Job key={i}>{job.name}</Job>
    })
  }

  render() {
    return (
      <div>
        <h1>People</h1>
        <Jobs>
          {this.listJobs()}
        </Jobs>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  jobs: state.jobs
})

const mapDispatchToProps = dispatch => ({
  getJobs: () => dispatch(fetchJobs())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)
