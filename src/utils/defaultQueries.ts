export const defaultQueries = {
    blocks: {
        fields: ['level', 'timestamp', 'hash', 'baker', 'meta_cycle'],
        predicates: [{ field: 'timestamp', set: [1569888000000], operation: 'after', inverse: false }],
        orderBy: [{ field: 'level', direction: 'desc' }],
        limit: 1000
    },
    operations: {
        fields: ['timestamp', 'block_level', 'source', 'destination', 'amount', 'kind', 'fee', 'operation_group_hash'],
        predicates: [{ field: 'kind', set: ['transaction'], operation: 'eq', inverse: false }, { field: 'timestamp', set: [1569888000000], operation: 'after', inverse: false }],
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
    rolls: {
        fields: [],
        predicates: [{ field: 'block_level', set: [631060], operation: 'gt', inverse: false }],
        orderBy: [{ field: 'block_level', direction: 'desc' }, { field: 'rolls', direction: 'desc' }],
        limit: 1000
    },
    fees: {
        fields: ['kind', 'timestamp', 'high', 'medium', 'low'],
        predicates: [{ field: 'kind', set: ['transaction', 'origination'], operation: 'in', inverse: false }, { field: 'timestamp', set: [1569888000000], operation: 'after', inverse: false }],
        orderBy: [{ field: 'timestamp', direction: 'desc' }, { field: 'kind', direction: 'asc' }],
        limit: 1000
    },
    balance_updates: {
        fields: [],
        predicates: [{ field: 'level', set: [631060], operation: 'gt', inverse: false }],
        orderBy: [],
        limit: 1000
    },
    ballots: {
        fields: [],
        predicates: [{ field: 'block_level', set: [631060], operation: 'gt', inverse: false }],
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
