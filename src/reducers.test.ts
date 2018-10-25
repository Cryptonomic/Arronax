import arronaxReducer from "./reducers";
import * as actions from "./actions";
/**
 * FIXTURES
 */
const testFilter = {
  block_id: [],
  block_level: [],
  block_netid: [],
  block_protocol: [],
  operation_id: [],
  operation_source: [],
  operation_destination: [],
  operation_participant: [],
  operation_kind: [],
  account_id: [],
  account_manager: [],
  account_delegate: [],
  limit: 100,
};

const initialState = arronaxReducer(undefined, {} as any);

/**
 * STORIES
 */
describe("Arronax stories", () => {
  describe("initial state", () => {
    it("should match a snapshot", () => {
      expect(initialState).toMatchSnapshot();
    });
  });
  describe("switch tab", () => {
    it("should switch to random tab", () => {
      const tab: number = Math.floor(Math.random() * 10);
      const action = actions.switchTab(tab);
      const state = arronaxReducer(initialState, action);
      expect(state.dataView).toEqual(tab);
    });
  });
  describe("set network", () => {
    it("should set network", () => {
      const action = actions.setNetwork("someNetwork");
      const state = arronaxReducer(initialState, action);
      expect(state.network).toEqual("someNetwork");
    });
  });
  describe("set filters", () => {
    it("should set filters", () => {
      const action = actions.setFilter(testFilter);
      const state = arronaxReducer(initialState, action);
      expect(state.filters).toEqual(testFilter);
    });
    it("should change filter limit", () => {
      const LIMIT = 10;
      const action = actions.setFilter({ ...testFilter, limit: LIMIT });
      const state = arronaxReducer(initialState, action);
      expect(state.filters.limit).not.toEqual(testFilter.limit);
      expect(state.filters.limit).toEqual(LIMIT);
    });
  });
});
