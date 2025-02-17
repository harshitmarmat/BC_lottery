const assert = require('assert');
const genache = require('ganache');
const { Web3 } = require('web3')
const {interface , bytecode  } = require("../compile");
const web3 = new Web3(genache.provider())

let account ;
let lottery ;

beforeEach(async () => {
    account = await  web3.eth.getAccounts()
    lottery = await new web3.eth.Contract(JSON.parse(interface)).deploy({data : bytecode}).send({from : account[0],gas : "1000000"})
    
})


describe("Lottery",()=> {
    it("Deploys a new lottery contract",  () => {
        assert.ok(lottery.options.address)
    })
    
    it("Allows a player to enter the lottery", async () => {
        await lottery.methods.addPlayer().send({
            from : account[0],
            value : web3.utils.toWei('0.02','ether')
        })
        const players = await lottery.methods.getAllPlayer().call({from : account[0]})
        assert(players[0],account[0])
        assert(1,players.length)
    })

    it("allow multiple players to enter the lottery", async () => {
        await lottery.methods.addPlayer().send({
            from : account[0],
            value : web3.utils.toWei('0.02','ether')
        })
        await lottery.methods.addPlayer().send({
            from : account[1],
            value : web3.utils.toWei('0.03','ether')
        })
        await lottery.methods.addPlayer().send({
            from : account[2],
            value : web3.utils.toWei('0.23','ether')
        })
        const players = await lottery.methods.getAllPlayer().call({from : account[0]})

        assert(players[0],account[0])
        assert(players[1],account[1])
        assert(players[2],account[2])
        assert(3,players.length)
    })

    it("require more than 0.01 ether to enter the lottery", async () => {
        try {
            await lottery.methods.addPlayer().send({
                from : account[0],
                value : 100
            })
            assert(false)
        }catch(err) {
            assert(err)
        }
    })

    it("only manager can call pickWinner function", async () => {
        try {
            await lottery.methods.pickWinner().send({
                from : account[1]
            })
            assert(false)
        }
        catch(err) {
            assert(err)
        }
    })

    it("end to end ", async () => {
        await lottery.methods.addPlayer().send({
            from : account[0],
            value : web3.utils.toWei('2','ether')
        })
        const initialBalance = await web3.eth.getBalance(account[0]);
        await lottery.methods.pickWinner().send({
            from : account[0]
        })

        const finalBalance = await web3.eth.getBalance(account[0]);
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.8','ether'))  // 1.8 ether is the minimum winning amount)
    })
})