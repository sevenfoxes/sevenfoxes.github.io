import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import * as actions from './NavigationActions'
import * as types from '../constants/actionTypes'
const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)
const testUsers = [
  {
    userId: 1,
    id: 1,
    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto'
  }
]

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('creates FETCH_JOBS_SUCCESS when fetching pages has been done', () => {

    nock('https://jsonplaceholder.typicode.com')
      .get('/users')
      .reply(200, testUsers)

    const store = mockStore({jobs: []})
    const expectedActions = [
      { type: types.FETCH_JOBS_REQUEST },
      { type: types.FETCH_JOBS_SUCCESS, body: testUsers }
    ]

    return store.dispatch(actions.fetchJobs())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
