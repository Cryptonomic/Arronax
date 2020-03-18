export const defaultQueries: any = {
    blocks: {
        fields: ['timestamp', 'meta_voting_period', 'meta_cycle', 'level', 'baker', 'hash', 'priority'],
        predicates: [{ field: 'timestamp', operation: 'after', set: [-1966080000], inverse: false }],
        orderBy: [{ field: 'level', direction: 'desc' }],
        aggregation:[],
        limit: 1000

    },
    operations: {
        fields: ['timestamp', 'block_level', 'source', 'destination', 'amount', 'kind', 'fee', 'status', 'operation_group_hash'],
        predicates: [
            { field: 'kind', set: ['transaction'], operation: 'eq', inverse: false },
            { field: 'timestamp', set: [-1966080000], operation: 'after', inverse: false },
            { field: "status", operation: "eq", set: ['applied'], inverse: false}],
        orderBy: [{ field: 'timestamp', direction: 'desc' }],
        limit: 1000
    },
    accounts: {
        fields: ['block_level', 'account_id', 'balance', 'delegate_value', 'storage', 'counter'],
        predicates:[
            { field: 'balance', operation: 'gt', set:[0], inverse: false },
            { field: 'block_level', operation: 'gt', set: [805066], inverse: false }],
        orderBy: [{ field: 'block_level', direction: 'desc' }],
        aggregation: [],
        limit: 1000
    },
    fees: {
        fields: ['cycle', 'kind', 'high', 'medium', 'low'],
        predicates: [
            { field: 'kind', operation: 'in', set: ['transaction', 'origination', 'delegation'], inverse: false },
            { field: 'timestamp', operation: 'after', set: [-1966080000], inverse: false }],
        orderBy: [{ field: 'cycle', direction: 'desc' }],
        aggregation: [
            { field: 'high', function: 'avg' },
            { field: 'medium', function: 'avg' },
            { field: 'low', function: 'avg' }],
        limit: 1000
    },
    balance_updates: {
        fields: [],
        predicates: [{ field: 'level', set: [805066], operation: 'gt', inverse: false }],
        orderBy: [],
        limit: 1000
    },
    delegates: {
        fields: ['block_level', 'pkh', 'balance', 'delegated_balance', 'staking_balance'],
        predicates: [{ field: 'deactivated',operation: 'eq',set: [false], inverse: false }],
        orderBy: [{ field: 'block_level', direction: 'desc' }],
        aggregation: [],
        limit: 1000
    },
    governance: {
        fields: ["voting_period", "proposal_hash", "voting_period_kind", "yay_count", "yay_rolls", "pass_count", "pass_rolls", "nay_count", "nay_rolls"],
        predicates: [],
        orderBy: [ { field: "voting_period", direction: "desc"} ],
        aggregation: [
            { field: "nay_count", function: "sum"},
            { field: "nay_rolls", function: "sum"},
            { field: "pass_count", function: "sum"},
            { field: "pass_rolls", function: "sum"},
            { field: "yay_count", function: "sum"},
            { field: "yay_rolls", function: "sum"} ],
        limit: 1000},
    baking_rights: {
        fields: ['level', 'priority', 'delegate', 'estimated_time'],
        predicates: [{ field: 'priority', operation: 'in', set: ['0','1'], inverse: false }, { field: 'estimated_time', operation: 'after', set: [-1966080000], inverse: false}],
        orderBy: [{ field: 'level', direction: 'desc'}],
        aggregation: [],
        limit: 1000
    },
    endorsing_rights: {
        fields: ['level', 'slot', 'delegate', 'estimated_time'],
        predicates: [{ field: 'estimated_time', operation: 'after', set: [-1966080000], inverse: false}],
        orderBy: [{ field: 'level', direction: 'desc' }],
        aggregation: [],
        limit: 1000
    },
    accounts_history: {
        fields: ['asof', 'block_level', 'account_id', 'balance', 'delegate_value', 'storage', 'counter'],
        predicates: [{field: 'asof', operation: 'after', set:[-1966080000], inverse:false}],
        orderBy: [{field: 'block_level', direction: 'desc'}],
        aggregation: [],
        limit: 1000

    },
};

export const CARDINALITY_NUMBER = 25;
