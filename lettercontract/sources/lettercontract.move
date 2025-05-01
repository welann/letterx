module lettercontract::lettercontract;

use std::string::String;
use sui::event::emit;
use sui::table::{Self, Table};

/* === errors === */
///没找到blobid对应的letter
const ELetterNotFound: u64 = 0x1;

/* === type define === */
public struct Letter has key, store {
    id: UID,
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
    let id = object::new(ctx);
    let letter = Letter {
        id: id,
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
    let removedletter = userletters.letters.remove(letterid);
    let (result, index) = userletters.letterindex.index_of(&removedletter.blobid);
    assert!(result, ELetterNotFound);
    userletters.letterindex.remove(index);
    manager.deleted_letters.push_back(removedletter);
}

public entry fun search(
    manager: &mut UserManager,
    useraddress: address,
): (&Table<String, Letter>, &Table<String, Letter>) {
    let user = table::borrow(&manager.usertable, useraddress);
    (&user.letters, &user.expired_letters)
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
            let letterid_val = *letterid;
            let letter = userletters.expired_letters.borrow(letterid_val);
            let newletter = LetterPublic {
                blobid: letter.blobid,
                endepoch: letter.endepoch,
                recipient: letter.recipient,
                ispublic: letter.ispublic,
            };
            if (letter.ispublic) {
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
public entry fun alert(manager: &mut UserManager, useraddress: address, blobid: String) {
    let userletters = manager.usertable.borrow_mut(useraddress);
    // let letter=userletters.letters.borrow(blobid);
    userletter
}
