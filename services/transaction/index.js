const {ApolloServer, gql} = require("apollo-server");
const {buildFederatedSchema} = require("@apollo/federation");

const typeDefs = gql`
    extend type Query {
        transactions: [Transaction]
    }
    type Transaction @key(fields: "txid") {
        txid: ID!
        from: String
        to: String
        value: Int
    }
    extend type Account @key(fields: "address"){
        address: String! @external
        balance: Int @requires(fields: "address")
        transactions: [Transaction] @requires(fields: "address")
    }
`

const resolvers = {
    Query: {
        transactions() {
            return transactions;
        }
    },
    Transaction: {
        __resolveReference(object) {
            return address.find(tx => tx.txid === object.txid);
        }
    },
    Account: {
        transactions(object) {
            console.log('res', transactions.find(tx => (tx.from === object.address || tx.to === object.address)))
            return transactions.filter(tx => (tx.from === object.address || tx.to === object.address))
        },
        balance(object) {
            const incomeTxs = transactions.filter(tx => tx.to === object.address);
            let incomeValue = 0;
            for (let txs of incomeTxs) {
                incomeValue += txs.value;
            }
            const outcomeTxs = transactions.filter(tx => tx.from === object.address);
            let outcomeValue = 0;
            for (let txs of outcomeTxs) {
                outcomeValue += txs.value;
            }
            return (incomeValue - outcomeValue);
        }
    }
}


const server = new ApolloServer({
    schema: buildFederatedSchema([
        {
            typeDefs,
            resolvers
        }
    ])
});

server.listen({port: 4002}).then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});

const transactions = [
    {
        txid: "1",
        from: "0x000",
        to: "0x111",
        value: 50
    },
    {
        txid: "2",
        from: "0x000",
        to: "0x222",
        value: 40
    },
    {
        txid: "3",
        from: "0x111",
        to: "0x222",
        value: 10
    },
    {
        txid: "4",
        from: "0x222",
        to: "0x111",
        value: 20
    },
]