import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import expect from 'expect'
import * as actions from './NavigationActions'
import * as types from '../constants/actionTypes'
const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)
const testPages = [
  {
    id: 2,
    guid: {},
    slug: 'sample-page',
    type: 'page',
    link: 'http://localhost:8080/sample-page/',
    parent: 0,
    menu_order: 0,
  }
]
describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })
  it('creates FETCH_PAGES_SUCCESS when fetching pages has been done', () => {
    nock('http://localhost:8080/')
      .get('/wp-json/wp/v2/pages')
      .reply(200, testPages)
    const store = mockStore({pages: []})
    const expectedActions = [
      { type: types.FETCH_PAGES_REQUEST },
      { type: types.FETCH_PAGES_SUCCESS, body: testPages }
    ]

    return store.dispatch(actions.fetchPages())
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
