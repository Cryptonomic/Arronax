export const defaultQueries = {
    blocks: {
        fields: ['level', 'timestamp', 'hash', 'baker', 'meta_cycle'],
        predicates: [{ field: 'timestamp', set: [1569902400000], operation: 'after', inverse: false }],
        orderBy: [{ field: 'level', direction: 'desc' }],
        limit: 1000
    },
    operations: {
        fields: ['timestamp', 'block_level', 'source', 'destination', 'amount', 'kind', 'fee', 'operation_group_hash'],
        predicates: [{ field: 'kind', set: ['transaction'], operation: 'eq', inverse: false }, { field: 'timestamp', set: [1556683200000], operation: 'after', inverse: false }],
        orderBy: [{ field: 'timestamp', direction: 'desc' }],
        limit: 1000
    },
    accounts: {
        fields: ['account_id', 'manager', 'delegate_value', 'balance'],
        predicates: [
            { field: 'account_id', set: ['KT1'], operation: 'startsWith', inverse: true },
            { field: 'balance', set: [0], operation: 'gt', inverse: false }],
        orderBy: [{ field: 'block_level', direction: 'desc' }],
        limit: 1000
    },
    fees: {
        fields: ['cycle', 'kind', 'high', 'medium', 'low'],
        "predicates": [
            { field: 'kind', "operation": "in", "set": ["transaction", "origination"], "inverse": false},
            { field: 'timestamp', "operation": "after", set: [1569902400000], "inverse" :false}],
        "orderBy":[{ field: "cycle", direction: "desc" }],
        "aggregation":[
            { field: "high", function: "avg" },
            { field: "medium", function: "avg" },
            { field: "low", function: "avg" }],
        "limit":1000}
    },
    balance_updates: {
        fields: [],
        predicates: [{ field: 'level', set: [418201], operation: 'gt', inverse: false }],
        orderBy: [],
        limit: 1000
    },
    ballots: {
        fields: [],
        predicates: [{ field: 'block_level', set: [418201], operation: 'gt', inverse: false }],
        orderBy: [],
        limit: 1000
    },
    delegates: {
        fields: ["block_level", "pkh", "balance", "staking_balance"],
        predicates: [{ field: 'deactivated', set: [false], operation: 'eq', inverse: false }],
        orderBy: [{ field: "staking_balance", direction: "desc" }],
        limit: 1000
    }
};

export const CARDINALITY_NUMBER = 25;
