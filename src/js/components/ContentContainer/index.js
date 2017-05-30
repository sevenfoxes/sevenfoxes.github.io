import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchPages } from '../../actions/NavigationActions'
class ContentContainer extends Component {
  componentWillMount() {
    this.props.getPages()
  }
  render() {
    return (
      <div>
        {JSON.stringify(this.props.pages)}
      </div>
    )
  }
};
export default connect(state => ({
  pages: state.pages,
}), dispatch => ({
  getPages: () => dispatch(fetchPages())
}))(ContentContainer)
