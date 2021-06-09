const ethereumQueries: any = {
    blocks: {
        fields: [
            "timestamp","level","hash","miner","gas_used","total_difficulty","receipts_root", 'transactions_root'
        ],
        predicates: [
            // { field: 'timestamp', operation: 'after', set: [-1966080000], inverse: false }
        ],
        orderBy: [
            { field: 'level', direction: 'desc' }
        ],
        aggregation:[],
        limit: 1000
    },
    transactions: {
        fields: ["block_hash","block_level","hash","source","destination","amount","gas","input","nonce"],
        predicates: [
            // { field: 'kind', set: ['transaction'], operation: 'eq', inverse: false },
            // { field: 'timestamp', set: [-1966080000], operation: 'after', inverse: false },
            // { field: "status", operation: "eq", set: ['applied'], inverse: false}
        ],
        orderBy: [
            { field: 'block_level', direction: 'desc' }
        ],
        limit: 1000
    },
    contracts: {
        fields: [],
        predicates:[
            // { field: 'balance', operation: 'gt', set:[0], inverse: false },
            // { field: 'block_level', operation: 'gt', set: [805066], inverse: false }
        ],
        orderBy: [
            { field: "block_level", direction: "desc"}
        ],
        aggregation: [],
        limit: 1000
    },
    logs: {
        fields: ["block_level","block_hash","address","transaction_hash","data","topics"],
        predicates:[
            // { field: 'removed', operation: 'eq', set:["false"], inverse: false }
        ],
        orderBy: [
            { field: 'block_level', direction: 'desc' }
        ],
        aggregation: [],
        limit: 1000
    },
    receipts: {
        fields: [ "block_level","block_hash","transaction_hash","contract_address","gas_used","logs_bloom","root"],
        predicates:[
            // { field: 'balance', operation: 'gt', set:[0], inverse: false },
            // { field: 'block_level', operation: 'gt', set: [805066], inverse: false }
        ],
        orderBy: [
            { field: "block_level", direction: "desc"}
        ],
        aggregation: [],
        limit: 1000
    }
};

const bitcoinQueries: any = {
    blocks: {
        fields: ["time", "level", "hash", "previous_block_hash", "next_block_hash"],
        predicates: [
            // { field: 'timestamp', operation: 'after', set: [-1966080000], inverse: false }
        ],
        orderBy: [
            { field: 'level', direction: 'desc' }
        ],
        aggregation:[],
        limit: 1000
    }, 
    transactions: {
        fields: ["block_time", "txid", "block_hash", "block_level", "hash"],
        predicates: [
            // { field: 'timestamp', operation: 'after', set: [-1966080000], inverse: false }
        ],
        orderBy: [
            { field: 'block_level', direction: 'desc' }
        ],
        aggregation:[],
        limit: 1000
    }, 
    outputs: {
        fields: ["block_time", "txid", "block_hash", "block_level", "value"],
        predicates: [
            // { field: 'timestamp', operation: 'after', set: [-1966080000], inverse: false }
        ],
        orderBy: [
            { field: 'block_level', direction: 'desc' }
        ],
        aggregation:[],
        limit: 1000
    }, 
    inputs: {
        fields: ["block_time", "txid", "block_hash", "block_level", "output_txid", "coinbase"],
        predicates: [
            // { field: 'timestamp', operation: 'after', set: [-1966080000], inverse: false }
        ],
        orderBy: [
            { field: 'block_level', direction: 'desc' }
        ],
        aggregation:[],
        limit: 1000
    }, 
}

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
        fields:["proposal_hash","voting_period_kind","yay_count","yay_rolls","pass_count","pass_rolls","nay_count","nay_rolls","level"],
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
    ethereum: ethereumQueries,
    bitcoin: bitcoinQueries
};

export const CARDINALITY_NUMBER = 25;
