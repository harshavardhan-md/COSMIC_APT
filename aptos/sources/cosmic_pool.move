module cosmic_pool::cosmic_pool {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_std::table::{Self, Table};

    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_ADMIN: u64 = 3;
    const E_COMMITMENT_NOT_FOUND: u64 = 4;
    const E_ALREADY_WITHDRAWN: u64 = 5;
    const E_COMMITMENT_ALREADY_EXISTS: u64 = 8;

    const WITHDRAWAL_AMOUNT: u64 = 10000; // 0.00001 APT

    struct CosmicPool has key {
        admin: address,
        commitments: Table<vector<u8>, bool>,
        nullifiers: Table<vector<u8>, bool>,
        total_deposits: u64,
        total_withdrawals: u64,
    }

    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        assert!(!exists<CosmicPool>(account_addr), E_ALREADY_INITIALIZED);
        move_to(account, CosmicPool {
            admin: account_addr,
            commitments: table::new(),
            nullifiers: table::new(),
            total_deposits: 0,
            total_withdrawals: 0,
        });
    }

    public entry fun sync_commitment(
        admin: &signer,
        pool_address: address,
        commitment: vector<u8>
    ) acquires CosmicPool {
        assert!(exists<CosmicPool>(pool_address), E_NOT_INITIALIZED);
        let pool = borrow_global_mut<CosmicPool>(pool_address);
        assert!(signer::address_of(admin) == pool.admin, E_NOT_ADMIN);
        assert!(!table::contains(&pool.commitments, commitment), E_COMMITMENT_ALREADY_EXISTS);
        table::add(&mut pool.commitments, commitment, true);
        pool.total_deposits = pool.total_deposits + 1;
    }

    // Keep withdraw function but just mark as withdrawn
    public entry fun withdraw(
        admin: &signer,
        pool_address: address,
        commitment: vector<u8>
    ) acquires CosmicPool {
        assert!(exists<CosmicPool>(pool_address), E_NOT_INITIALIZED);
        let pool = borrow_global_mut<CosmicPool>(pool_address);
        assert!(signer::address_of(admin) == pool.admin, E_NOT_ADMIN);
        assert!(table::contains(&pool.commitments, commitment), E_COMMITMENT_NOT_FOUND);
        assert!(!table::contains(&pool.nullifiers, commitment), E_ALREADY_WITHDRAWN);
        
        table::add(&mut pool.nullifiers, commitment, true);
        pool.total_withdrawals = pool.total_withdrawals + 1;
    }

    #[view]
    public fun has_commitment(pool_address: address, commitment: vector<u8>): bool acquires CosmicPool {
        if (!exists<CosmicPool>(pool_address)) {
            return false
        };
        let pool = borrow_global<CosmicPool>(pool_address);
        table::contains(&pool.commitments, commitment)
    }

    #[view]
    public fun is_withdrawn(pool_address: address, commitment: vector<u8>): bool acquires CosmicPool {
        if (!exists<CosmicPool>(pool_address)) {
            return false
        };
        let pool = borrow_global<CosmicPool>(pool_address);
        table::contains(&pool.nullifiers, commitment)
    }

    #[view]
    public fun get_stats(pool_address: address): (u64, u64) acquires CosmicPool {
        assert!(exists<CosmicPool>(pool_address), E_NOT_INITIALIZED);
        let pool = borrow_global<CosmicPool>(pool_address);
        (pool.total_deposits, pool.total_withdrawals)
    }

    #[view]
    public fun get_admin(pool_address: address): address acquires CosmicPool {
        assert!(exists<CosmicPool>(pool_address), E_NOT_INITIALIZED);
        let pool = borrow_global<CosmicPool>(pool_address);
        pool.admin
    }
}