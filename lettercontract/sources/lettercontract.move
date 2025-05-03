module lettercontract::lettercontract;


use std::string::String;
use sui::event::emit;
use sui::table::{Self, Table};


/* === errors === */
///没找到blobid对应的letter
const ELetterNotFound: u64 = 1;
const EUserNotFound: u64 = 2;


/* === type define === */
public struct Letter has copy, drop, store {
    blobid: String,
    endepoch: u64,
    recipient: address,
    ispublic: bool,
}

public struct LetterPublic has copy, drop {
    blobid: String,
    endepoch: u64,
    recipient: address,
    ispublic: bool,
}

public struct Userletters has key, store {
    id: UID,
    letters: Table<String, Letter>,
    letterindex: vector<String>,
    expired_letters: Table<String, Letter>,
    expired_letterindex: vector<String>,
}

public struct UserManager has key, store {
    id: UID,
    usertable: Table<address, Userletters>,
    userindex: vector<address>,
    deleted_letters: vector<Letter>,
}

/* === events === */
public struct UserManagerCreated has copy, drop {
    manager_id: ID,
    message: String,
}

fun init(ctx: &mut TxContext) {
    let manager = UserManager {
        id: object::new(ctx),
        usertable: table::new(ctx),
        userindex: vector::empty(),
        deleted_letters: vector::empty(),
    };
    emit(UserManagerCreated {
        manager_id: manager.id.to_inner(),
        message: b"UserManager created".to_string(),
    });

    transfer::share_object(manager);
}

public entry fun addletter(
    manager: &mut UserManager,
    blobid: String,
    endepoch: u64,
    recipient: address,
    ispublic: bool,
    ctx: &mut TxContext,
) {
    let letter = Letter {
        blobid: blobid,
        endepoch: endepoch,
        recipient: recipient,
        ispublic: ispublic,
    };
    if (!manager.usertable.contains(ctx.sender())) {
        //创建一个新的用户
        let mut userletters = Userletters {
            id: object::new(ctx),
            letters: table::new(ctx),
            letterindex: vector::empty(),
            expired_letters: table::new(ctx),
            expired_letterindex: vector::empty(),
        };
        //存放数据到userletters中
        userletters.letters.add(blobid, letter);
        userletters.letterindex.push_back(blobid);
        //存放数据到manager中
        manager.usertable.add(ctx.sender(), userletters);
        manager.userindex.push_back(ctx.sender());
    } else {
        let userletters = manager.usertable.borrow_mut(ctx.sender());
        userletters.letters.add(blobid, letter);
        userletters.letterindex.push_back(blobid);
    }
}

public entry fun deleteletter(manager: &mut UserManager, letterid: String, ctx: &mut TxContext) {
    let userletters = manager.usertable.borrow_mut(ctx.sender());
    let (removed, letterindex) = userletters.letterindex.index_of(&letterid);
    assert!(removed, ELetterNotFound);

    let removedletter = userletters.letters.remove(letterid);
    userletters.letterindex.remove(letterindex);
    manager.deleted_letters.push_back(removedletter);
}

//todo 这里应该判断合约调用方是不是和useraddress一致，否则需要报错
//限制只有本人可以查询本人所有的信件
public entry fun search(
    manager: &mut UserManager,
    useraddress: address,
): (vector<Letter>, vector<Letter>) {
    // 检查用户是否存在
    assert!(manager.usertable.contains(useraddress), EUserNotFound);

    let userletters = manager.usertable.borrow(useraddress);

    // 获取活跃信件
    let mut active_letters: vector<Letter> = vector::empty();
    let mut i = 0;
    while (i < userletters.letterindex.length()) {
        let blobid = userletters.letterindex.borrow(i);
        let letter = userletters.letters.borrow(*blobid);
        active_letters.push_back(*letter);
        i = i + 1;
    };

    // 获取过期信件
    let mut expired_letters: vector<Letter> = vector::empty();
    let mut j = 0;
    while (j < userletters.expired_letterindex.length()) {
        let blobid = userletters.expired_letterindex.borrow(j);
        let letter = userletters.expired_letters.borrow(*blobid);
        expired_letters.push_back(*letter);
        j = j + 1;
    };

    (active_letters, expired_letters)
}

public entry fun searchpublic(manager: &mut UserManager): vector<LetterPublic> {
    let mut i = 0;
    let mut publicletters: vector<LetterPublic> = vector::empty();
    while (i < manager.userindex.length()) {
        let useraddress = manager.userindex.borrow(i);
        let userletters = manager.usertable.borrow(*useraddress);

        let mut j = 0;
        while (j < userletters.expired_letterindex.length()) {
            let letterid = userletters.expired_letterindex.borrow(j);
            let letter = userletters.expired_letters.borrow(*letterid);
            if (letter.ispublic) {
                let newletter = LetterPublic {
                    blobid: letter.blobid,
                    endepoch: letter.endepoch,
                    recipient: letter.recipient,
                    ispublic: letter.ispublic,
                };
                publicletters.push_back(newletter);
            };
            j = j + 1;
        };
        i = i+1;
    };

    publicletters
}

//sui的epoch和walrus的epoch是没办法在合约里进行计算的
//如果需要的话，需要自行维护一个预言机，比如生成一个权限，只有某个地址可以更新这个计算公式等等
//但是现在一切从简吧

//将用户的信件从letters移到expired_letters
public entry fun alert(manager: &mut UserManager, useraddress: address, blobid: String) {
    let userletters = manager.usertable.borrow_mut(useraddress);
    // let letter=userletters.letters.borrow(blobid);
    let (find, letterindex) = userletters.letterindex.index_of(&blobid);
    assert!(find, ELetterNotFound);

    // 从letters表中移除信件
    let letter = userletters.letters.remove(blobid);
    userletters.letterindex.remove(letterindex);

    // 将信件添加到expired_letters表
    userletters.expired_letters.add(blobid, letter);
    userletters.expired_letterindex.push_back(blobid);
}

/* === test === */
#[test_only]
use sui::test_scenario as ts;
#[test_only]
use sui::test_utils::assert_eq;
#[test_only]
use std::debug::print;
#[test_only]
const Eusertableisempty: u64 = 3;
#[test_only]
const Elettertableisempty: u64 = 4;
#[test_only]
const Eactiveletterisempty: u64 = 5;
#[test_only]
const Eexpiredletterisempty: u64 = 6;
#[test_only]
const Epublcicletterisempty: u64 = 7;

#[test]
fun test_addletter() {
    let mut ts = ts::begin(@0x0);
    init(ts.ctx());
    {
        ts.next_tx(@0x112);
        let mut lmanager: UserManager = ts.take_shared();
        assert!(lmanager.usertable.is_empty(), Eusertableisempty);

        addletter(&mut lmanager, b"one".to_string(), 12, @0x1, true, ts.ctx());
        let userletters = lmanager.usertable.borrow_mut(@0x112);

        assert!(!userletters.letters.is_empty(), Elettertableisempty);
        assert_eq(userletters.letters.length(), 1);
        assert_eq(userletters.letterindex.length(), 1);
        ts::return_shared(lmanager);
    };

    ts.end();
}

#[test]
#[expected_failure(abort_code = ELetterNotFound)]
fun test_deleteletter() {
    let mut ts = ts::begin(@0x0);
    init(ts.ctx());

    // 测试正常删除信件
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();

        // 添加信件
        addletter(&mut lmanager, b"one".to_string(), 12, @0x1, true, ts.ctx());
        addletter(&mut lmanager, b"two".to_string(), 24, @0x1, false, ts.ctx());

        // 验证添加成功
        let userletters = lmanager.usertable.borrow(@0x112);
        assert_eq(userletters.letters.length(), 2);
        assert_eq(userletters.letterindex.length(), 2);
        // 删除第一个信件
        deleteletter(&mut lmanager, b"one".to_string(), ts.ctx());

        // 重新获取用户信件数据
        let userletters = lmanager.usertable.borrow(@0x112);
        // 验证删除结果
        assert_eq(userletters.letters.length(), 1);
        assert_eq(userletters.letterindex.length(), 1);
        assert_eq(lmanager.deleted_letters.length(), 1);

        // 验证剩余信件是否正确
        let remaining_letter = userletters.letters.borrow(b"two".to_string());
        assert_eq(remaining_letter.blobid, b"two".to_string());
        assert_eq(remaining_letter.endepoch, 24);
        assert_eq(remaining_letter.ispublic, false);

        ts::return_shared(lmanager);
    };

    // 测试删除最后一个信件
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();

        // 删除最后一个信件
        deleteletter(&mut lmanager, b"two".to_string(), ts.ctx());

        // 验证结果
        let userletters = lmanager.usertable.borrow(@0x112);
        assert!(userletters.letters.is_empty(), Elettertableisempty);
        assert!(userletters.letterindex.is_empty(), Elettertableisempty);
        assert_eq(lmanager.deleted_letters.length(), 2);

        ts::return_shared(lmanager);
    };

    // 测试删除不存在的信件
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();

        addletter(&mut lmanager, b"one".to_string(), 12, @0x1, true, ts.ctx());
        // 尝试删除不存在的信件 - 应该触发错误
        deleteletter(&mut lmanager, b"nonexistent".to_string(), ts.ctx());

        ts::return_shared(lmanager);
    };
    ts.end();
}

#[test]
#[expected_failure(abort_code = EUserNotFound)]
fun test_search() {
    let mut ts = ts::begin(@0x0);
    init(ts.ctx());

    // 1. 测试空用户情况
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();
        let (active, expired) = search(&mut lmanager, @0x112);
        assert!(vector::is_empty(&active), Eactiveletterisempty);
        assert!(vector::is_empty(&expired), Eexpiredletterisempty);
        ts::return_shared(lmanager);
    };

    // 2. 测试添加信件后的查询
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();
        addletter(&mut lmanager, b"one".to_string(), 12, @0x1, true, ts.ctx());

        let (active, expired) = search(&mut lmanager, @0x112);
        assert_eq(active.length(), 1);
        assert_eq(expired.length(), 0);
        assert_eq(active[0].blobid, b"one".to_string());
        ts::return_shared(lmanager);
    };

    // 3. 测试过期信件查询
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();
        alert(&mut lmanager, @0x112, b"one".to_string());

        let (active, expired) = search(&mut lmanager, @0x112);
        assert_eq(active.length(), 0);
        assert_eq(expired.length(), 1);
        assert_eq(expired[0].blobid, b"one".to_string());
        ts::return_shared(lmanager);
    };

    // 4. 测试混合状态信件查询
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();
        addletter(&mut lmanager, b"two".to_string(), 12, @0x1, true, ts.ctx());

        let (active, expired) = search(&mut lmanager, @0x112);
        assert_eq(active.length(), 1);
        assert_eq(expired.length(), 1);
        ts::return_shared(lmanager);
    };

    // 5. 测试不存在的用户
    {
        ts.next_tx(@0x113); // 不同用户
        let mut lmanager = ts.take_shared();
        let (_active, _expired) = search(&mut lmanager, @0x114); // 不存在的地址
        // 这里会触发assert错误，测试失败是预期的
        ts::return_shared(lmanager);
    };

    ts.end();
}

#[test]
fun test_searchpublic() {
    let mut ts = ts::begin(@0x0);
    init(ts.ctx());

    // 1. 测试空数据情况
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();

        let public_letters = searchpublic(&mut lmanager);
        assert!(vector::is_empty(&public_letters), Epublcicletterisempty);

        ts::return_shared(lmanager);
    };

    // 2. 测试只有私有信件的情况
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();

        // 添加私有信件
        addletter(&mut lmanager, b"private".to_string(), 12, @0x1, false, ts.ctx());
        // 将信件标记为过期
        alert(&mut lmanager, @0x112, b"private".to_string());

        let public_letters = searchpublic(&mut lmanager);
        assert!(vector::is_empty(&public_letters), Epublcicletterisempty);

        ts::return_shared(lmanager);
    };

    // 3. 测试单个公开信件
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();

        // 添加公开信件
        addletter(&mut lmanager, b"public1".to_string(), 12, @0x1, true, ts.ctx());
        // 将信件标记为过期
        alert(&mut lmanager, @0x112, b"public1".to_string());

        let public_letters = searchpublic(&mut lmanager);
        assert_eq(public_letters.length(), 1);
        assert_eq(public_letters[0].blobid, b"public1".to_string());
        assert_eq(public_letters[0].ispublic, true);

        ts::return_shared(lmanager);
    };

    // 4. 测试多个用户混合信件
    {
        // 第一个用户添加公开信件
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();
        addletter(&mut lmanager, b"public2".to_string(), 12, @0x1, true, ts.ctx());
        alert(&mut lmanager, @0x112, b"public2".to_string());
        ts::return_shared(lmanager);

        // 第二个用户添加混合信件
        ts.next_tx(@0x113);
        let mut lmanager = ts.take_shared();
        addletter(&mut lmanager, b"public3".to_string(), 12, @0x1, true, ts.ctx());
        addletter(&mut lmanager, b"private2".to_string(), 12, @0x1, false, ts.ctx());
        alert(&mut lmanager, @0x113, b"public3".to_string());
        alert(&mut lmanager, @0x113, b"private2".to_string());
        ts::return_shared(lmanager);

        // 查询公开信件
        ts.next_tx(@0x114);
        let mut lmanager = ts.take_shared();
        let public_letters = searchpublic(&mut lmanager);
        print(&public_letters.length().to_string());
        // 应该只包含两个公开信件
        assert_eq(public_letters.length(), 3);
        assert_eq(public_letters[0].blobid, b"public1".to_string());
        assert_eq(public_letters[1].blobid, b"public2".to_string());
        assert_eq(public_letters[2].blobid, b"public3".to_string());
        ts::return_shared(lmanager);
    };

    ts.end();
}

#[test]
#[expected_failure(abort_code = ELetterNotFound)]
fun test_alert() {
    let mut ts = ts::begin(@0x0);
    init(ts.ctx());

    // 测试正常alert信件
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();

        // 添加两封信件
        addletter(&mut lmanager, b"one".to_string(), 12, @0x1, true, ts.ctx());
        addletter(&mut lmanager, b"two".to_string(), 24, @0x1, false, ts.ctx());

        // 验证初始状态
        let userletters = lmanager.usertable.borrow(@0x112);
        assert_eq(userletters.letters.length(), 2);
        assert_eq(userletters.letterindex.length(), 2);
        assert_eq(userletters.expired_letters.length(), 0);
        assert_eq(userletters.expired_letterindex.length(), 0);

        // alert第一封信件
        alert(&mut lmanager, @0x112, b"one".to_string());

        let userletters = lmanager.usertable.borrow(@0x112);
        // 验证alert后的状态
        assert_eq(userletters.letters.length(), 1);
        assert_eq(userletters.letterindex.length(), 1);
        assert_eq(userletters.expired_letters.length(), 1);
        assert_eq(userletters.expired_letterindex.length(), 1);

        // 验证剩余活跃信件
        let remaining_letter = userletters.letters.borrow(b"two".to_string());
        assert_eq(remaining_letter.blobid, b"two".to_string());

        // 验证过期信件
        let expired_letter = userletters.expired_letters.borrow(b"one".to_string());
        assert_eq(expired_letter.blobid, b"one".to_string());
        assert_eq(expired_letter.ispublic, true);

        ts::return_shared(lmanager);
    };

    // 测试alert最后一个活跃信件
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();

        // alert最后一封信件
        alert(&mut lmanager, @0x112, b"two".to_string());

        // 验证最终状态
        let userletters = lmanager.usertable.borrow(@0x112);
        assert!(userletters.letters.is_empty(), Elettertableisempty);
        assert!(userletters.letterindex.is_empty());
        assert_eq(userletters.expired_letters.length(), 2);
        assert_eq(userletters.expired_letterindex.length(), 2);

        ts::return_shared(lmanager);
    };

    //测试alert不存在的信件
    {
        ts.next_tx(@0x112);
        let mut lmanager = ts.take_shared();

        // 先添加一个用户和信件
        addletter(&mut lmanager, b"one".to_string(), 12, @0x1, true, ts.ctx());

        // 尝试alert不存在的信件 - 应该触发错误
        alert(&mut lmanager, @0x112, b"nonexistent".to_string());

        ts::return_shared(lmanager);
    };

    ts.end();
}

//addletter
// sui client ptb \
// --assign sender @0x56e6362fd530999ec320fcf8b7ab06d9175fdd49ac32aec3ef3d924b7f1cbaa0 \
// --move-call 0x481bffff7826cef66f3dae9d58dee8c6193c553a3d47c8fdf15568a997cf9463::lettercontract::addletter @0x871518f740ebe98e175698066270866a0a461b3dae7c8c0c88526d1bf129e856 "'0x46b4e6072a489f45f4a57d2a79d06809659279dad12ca1a96b48e2a2e7b137be'" 12 @0x56e6362fd530999ec320fcf8b7ab06d9175fdd49ac32aec3ef3d924b7f1cbaa0 true

//deleteletter
// sui client ptb \
// --assign sender @0x56e6362fd530999ec320fcf8b7ab06d9175fdd49ac32aec3ef3d924b7f1cbaa0 \
// --move-call 0x481bffff7826cef66f3dae9d58dee8c6193c553a3d47c8fdf15568a997cf9463::lettercontract::deleteletter @0x871518f740ebe98e175698066270866a0a461b3dae7c8c0c88526d1bf129e856 "'0x46b4e6072a489f45f4a57d2a79d06809659279dad12ca1a96b48e'"

//alert
// sui client ptb \
// --assign sender @0x56e6362fd530999ec320fcf8b7ab06d9175fdd49ac32aec3ef3d924b7f1cbaa0 \
// --move-call 0x481bffff7826cef66f3dae9d58dee8c6193c553a3d47c8fdf15568a997cf9463::lettercontract::alert @0x871518f740ebe98e175698066270866a0a461b3dae7c8c0c88526d1bf129e856 @0x56e6362fd530999ec320fcf8b7ab06d9175fdd49ac32aec3ef3d924b7f1cbaa0 "'0x46b4e6072a489f45f4a57d2a79d06809659279dad12ca1a96b48e2a2e7b137be'"

