'use client'

import { useState, useEffect } from "react"

class Account {
  name: String;
  currency: String;
  balance: number;
  type: String;

  constructor(name: String,currency: String,balance: number,type: String) {
    this.name = name;
    this.currency = currency;
    this.balance = balance;
    this.type = type;
  }
}
class Transaction {
  fromAccountID: Number;
  toAccountID: Number;
  amount: number;

  constructor(fromAccountID: Number,toAccountID: number,amount: number) {
    this.fromAccountID = fromAccountID;
    this.toAccountID = toAccountID;
    this.amount = amount;
  }
}

export default function Home() {
  // State for accounts and transactions
  const [accounts, setAccounts] = useState([""]);
  const [transactions, setTransactions] = useState([""]);

  // State for forms
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountType, setNewAccountType] = useState("Saving");
  const [newAccountBalance, setNewAccountBalance] = useState(0);

  const [newTranFromID, setNewTranFromID] =useState(0);
  const [newTranToID, setNewTranToID] =useState(0);
  const [newTranAmount, setNewTranAmount] = useState(0.0);
  const [newTranType, setNewTranType] = useState("transfer");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/account');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAccounts(data); // Update the accounts state with fetched data
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };
  
    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/transaction');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTransactions(data); // Update the transactions state with fetched data
      } catch (err) {
        console.error('Error fetching transactions:', err);
      }
    };
  
    fetchTransactions();
  }, []);

  const handleAccountChange = (e) => {
    e.preventDefault();

    if(e.target.name == "accountName"){
      setNewAccountName(e.target.value);
    }
    if(e.target.name == "accountType"){
        setNewAccountType(e.target.value);
    }
    if(e.target.name == "accountBalance"){
     setNewAccountBalance(e.target.value);
    } 
  };

const handleAccountSubmit = async (e) => {
  e.preventDefault();
  const accountData = new Account(
    newAccountName,
    "HKD",
    newAccountBalance,
    newAccountType
  );

  try {
    const response = await fetch('http://localhost:8080/api/account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Refresh the accounts table
    const fetchAccounts = async () => {
      const response = await fetch('http://localhost:8080/api/account');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAccounts(data); // Update the accounts state with fetched data
    };

    await fetchAccounts();

    // Clear the form fields
    setNewAccountName("");
    setNewAccountType("Saving");
    setNewAccountBalance(0);
  } catch (err) {
    console.error('Error creating account:', err);
  }
};

const handleTranChange = (e) => {
  e.preventDefault();

  if(e.target.name == "fromAccountID"){
    setNewTranFromID(e.target.value);
  }
  if(e.target.name == "toAccountID"){
    setNewTranToID(e.target.value);
  }
  if(e.target.name == "newTranAmount"){
    setNewTranAmount(e.target.value);
  } 
  if(e.target.name == "newTranType"){
    setNewTranType(e.target.value);
   } 
};

const handleTranSubmit = async (e) => {
  e.preventDefault();
  const transactionData = new Transaction(
    newTranFromID,
    newTranToID,
    newTranAmount
  );

  try {
    const response = await fetch(`http://localhost:8080/api/transaction/${newTranType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Refresh the accounts table
    const fetchTransaction = async () => {
        const response = await fetch(`http://localhost:8080/api/transaction/${newTranType}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        else{
          const data = JSON.stringify(transactionData)
          setTransactions((prevTransactions) => [...prevTransactions, data]);
        }
      }

    await fetchTransaction();

    // Clear the form fields
    setNewTranFromID(0)
    setNewTranToID(0)
    setNewTranType("transfer")
    setNewTranAmount(0.0)
  } catch (err) {
    console.error('Error creating account:', err);
  }
};

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center">Banking System</h1>
      </header>

      <main className="space-y-10">
        <section>
          <h2 className="text-2xl font-bold mb-4">Accounts</h2>

          <div className="mb-6 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Account Number</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Currency</th>
                  <th className="border border-gray-300 px-4 py-2">Balance</th>
                  <th className="border border-gray-300 px-4 py-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border border-gray-300 px-4 py-2 text-center">
                      No accounts found
                    </td>
                  </tr>
                ) : (
                  accounts.map((account) => (
                    <tr key={account.accountID}> {/* Use a unique key for each row */}
                      <td className="border border-gray-300 px-4 py-2">{account.id}</td>
                      <td className="border border-gray-300 px-4 py-2">{account.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{account.currency}</td>
                      <td className="border border-gray-300 px-4 py-2">{account.balance}</td>
                      <td className="border border-gray-300 px-4 py-2">{account.type}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Account</h3>
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block mb-1">Account Name</label>
                  <input
                    type="text"
                    name="accountName"
                    value={newAccountName}
                    onChange={handleAccountChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Account Type</label>
                  <select
                    name="accountType"
                    value={newAccountType}
                    onChange={handleAccountChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="Savings">Savings</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Initial Balance</label>
                  <input
                    type="number"
                    name="accountBalance"
                    value={newAccountBalance}
                    onChange={handleAccountChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Add Account
              </button>
            </form>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Transactions</h2>

          <div className="mb-6 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">TransactionID</th>
                  <th className="border border-gray-300 px-4 py-2">FromAccount</th>
                  <th className="border border-gray-300 px-4 py-2">ToAccount</th>
                  <th className="border border-gray-300 px-4 py-2">Type</th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border border-gray-300 px-4 py-2 text-center">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="border border-gray-300 px-4 py-2">{transaction.transactionID}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.fromAccountID}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.toAccountID}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.transactionID==transaction.fromAccountID?"Deposit":"Transfer"}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.amount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Transaction</h3>
            <form onSubmit={handleTranSubmit}  className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">From account:</label>
                  <select
                    name="fromAccountID"
                    onChange={handleTranChange}
                    value={newTranFromID}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.name}>
                        {account.id} - {account.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">To account:</label>
                  <select
                    name="toAccountID"
                    onChange={handleTranChange}
                    value={newTranToID}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.name}>
                        {account.id} - {account.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Transaction Type</label>
                  <select
                    name="newTranType"
                    value={""}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  >
                    <option value="Transfer">Transfer</option>
                    <option value="Deposit">Deposit/Withdrawal</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Amount</label>
                  <input
                    type="number"
                    name="newTranAmount"
                    value={newTranAmount}
                    onChange={handleTranChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    step="0.01"
                    required
                  />
                </div>

              </div>

              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Add Transaction
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

