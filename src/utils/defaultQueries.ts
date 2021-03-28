const ethereumQueries: any = {
    blocks: {
        fields: [],
        predicates: [{ field: 'timestamp', operation: 'after', set: [-1966080000], inverse: false }],
        orderBy: [{ field: 'number', direction: 'desc' }],
        aggregation:[],
        limit: 1000
    },
    operations: {
        fields: [],
        predicates: [
            { field: 'kind', set: ['transaction'], operation: 'eq', inverse: false },
            { field: 'timestamp', set: [-1966080000], operation: 'after', inverse: false },
            { field: "status", operation: "eq", set: ['applied'], inverse: false}],
        orderBy: [{ field: 'timestamp', direction: 'desc' }],
        limit: 1000
    },
    accounts: {
        fields: [],
        predicates:[
            { field: 'balance', operation: 'gt', set:[0], inverse: false },
            { field: 'block_level', operation: 'gt', set: [805066], inverse: false }],
        orderBy: [{ field: 'block_level', direction: 'desc' }],
        aggregation: [],
        limit: 1000
    }
};

const tezosQueries: any = {
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
      "fields": [],
      "predicates": [],
      "orderBy": [
        {
          "field": "block_level",
          "direction": "desc"
        }
      ],
      "aggregation": [],
      "limit": 1000
    },
    bakers: {
        fields: ["pkh", "balance", "rolls", "delegated_balance", "frozen_balance", "staking_balance", "block_level"],
        predicates: [{ field: "deactivated", operation: "eq", set: ["false"] },
            { field: "rolls", operation: "gt", set: [0] }],
        orderBy: [{ field: "block_level", direction: "desc" }],
        aggregation: [],
        limit: 1000
    },
    governance: {
        fields:["voting_period","proposal_hash","voting_period_kind","yay_count","yay_rolls","pass_count","pass_rolls","nay_count","nay_rolls","level"],
        predicates: [],
        orderBy: [{field:"max_level", direction: "desc"}],
        aggregation: [
            {field:"level", function:"max"},
            {field:"yay_count", function:"max"},
            {field:"yay_rolls", function:"max"},
            {field:"pass_count", function:"max"},
            {field:"pass_rolls", function:"max"},
            {field:"nay_count", function:"max"},
            {field:"nay_rolls", function:"max"}],
        limit: 1000
    },
    baking_rights: {
        fields: ['block_level', 'priority', 'delegate', 'estimated_time'],
        predicates: [{ field: 'priority', operation: 'in', set: ['0','1'], inverse: false }, { field: 'estimated_time', operation: 'after', set: [-1966080000], inverse: false}],
        orderBy: [{ field: 'block_level', direction: 'desc'}],
        aggregation: [],
        limit: 1000
    },
    endorsing_rights: {
        fields: ['block_level', 'slot', 'delegate', 'estimated_time'],
        predicates: [{ field: 'estimated_time', operation: 'after', set: [-1966080000], inverse: false}],
        orderBy: [{ field: 'block_level', direction: 'desc' }],
        aggregation: [],
        limit: 1000
    },
    accounts_history: {
        fields: ['asof', 'block_level', 'account_id', 'balance', 'delegate_value', 'storage', 'counter'],
        predicates: [{field: 'asof', operation: 'after', set:[-1966080000], inverse:false}],
        orderBy: [{field: 'block_level', direction: 'desc'}],
        aggregation: [],
        limit: 1000

    }
};

export const defaultQueries: any = {
    tezos: tezosQueries,
    ethereum: ethereumQueries
};

export const CARDINALITY_NUMBER = 25;
