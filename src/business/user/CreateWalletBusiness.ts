import config from '@src/config';
import walletConstant from '@src/config/wallet';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import { generateString } from '@src/utils/helpers';
import { IUserWalletModel } from 'bo-trading-common/lib/models/userWallets';
import lightwallet from 'eth-lightwallet';
import moment from 'moment';
import Web3 from 'web3';

const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(walletConstant.RPC_ADDRESS));
const usdtContract = new web3.eth.Contract([
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address',
      },
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'version',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
      {
        name: '_extraData',
        type: 'bytes',
      },
    ],
    name: 'approveAndCall',
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
      {
        name: '_spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        name: 'remaining',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    inputs: [
      {
        name: '_initialAmount',
        type: 'uint256',
      },
      {
        name: '_tokenName',
        type: 'string',
      },
      {
        name: '_decimalUnits',
        type: 'uint8',
      },
      {
        name: '_tokenSymbol',
        type: 'string',
      },
    ],
    type: 'constructor',
  },
  {
    payable: false,
    type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_from',
        type: 'address',
      },
      {
        indexed: true,
        name: '_to',
        type: 'address',
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_owner',
        type: 'address',
      },
      {
        indexed: true,
        name: '_spender',
        type: 'address',
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  }
], walletConstant.ERC20_USDT_CONTRACT_ADDRESS);
export const createUSDTTRC20 = async (user: any): Promise<any> => {
  try {
    const TronWeb = require('tronweb');
    const privateKey = config.CRYPTO_PRIVATE_KEY;
    const tronWeb = new TronWeb({
      fullHost: config.TRON_FULL_NODE,
      headers: { "TRON-PRO-API-KEY": config.TRON_API_KEY },
      privateKey: privateKey
    });

    (async () => {
      const trc20Result = await tronWeb.createAccount();
      const userWalletRes = new UserWalletRepository();

      userWalletRes.create(<IUserWalletModel>{
        user_id: user.id,
        amount: 0,
        amount_trade: 0,
        amount_copytrade: 0,
        amount_expert: 0,
        amount_demo: 10000,
        trc20: JSON.stringify(trc20Result)
      });

      return true;
    })();
  } catch (err) {
    throw err;
  }
};

export const createUSDTERC20 = async (user: any): Promise<any> => {
  try {
    const dataWallet = generateWallet();
    const { seed, password } = dataWallet;
    const ks = await generateKeyStore(dataWallet);
    const { address, privateKey } = await generateAddress({ ks, password });
    //Store to DB
    const userWalletRes = new UserWalletRepository();
    const erc20_wallet = {
      address: address,
      address_password: password,
      address_seed: seed,
      address_private_key: privateKey,
    };
    userWalletRes.updateByUserId(user.id, { erc20: JSON.stringify(erc20_wallet) });
  } catch (err) {
    throw err;
  }
};

const generateWallet = () => {
  try {
    const password = generateString(walletConstant.GENERATED_PASSWORD_LENGTH);
    const seed = lightwallet.keystore.generateRandomSeed();

    return { seed, password };
  } catch (error) {
    throw error;
  }
};

const generateKeyStore = async ({ password, seed: seedPhrase }) => {
  try {
    const opt = {
      password,
      seedPhrase,
      hdPathString: walletConstant.HD_PATH_STRING,
    };

    const ks = await createVaultPromise(opt);
    // ks.passwordProvider = (callback) => {
    //   const pw = password;
    //   callback(null, pw);
    // };

    return ks;
  } catch (err) {
    const errorString = `genKeystore error - ${err}`;
    throw errorString;
  }
};

const generateAddress = async ({ ks, password }) => {
  const keyFromPasswordPromise = (param) => {
    return new Promise((resolve, reject) => {
      ks.keyFromPassword(param, (err, data) => {
        if (err !== null) return reject(err);
        return resolve(data);
      });
    });
  };

  try {
    const pwDerivedKey = await keyFromPasswordPromise(password);
    ks.generateNewAddress(pwDerivedKey, 1);
    const address = ks.getAddresses().slice(-1)[0];
    const privateKey = ks.exportPrivateKey(address, pwDerivedKey);

    return { address, privateKey };
  } catch (error) {
    throw error;
  }
};

const createVaultPromise = (param) => {
  return new Promise((resolve, reject) => {
    lightwallet.keystore.createVault(param, (err, data) => {
      if (err !== null) return reject(err);
      return resolve(data);
    });
  });
};

export const getBalanceEth = async (privateKey, address) => {
  try {
    const signer = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(signer);

    return web3.utils.fromWei(await web3.eth.getBalance(address));
  } catch (err) {
    const loc = err.message.indexOf('at runCall');
    const errMsg = loc > -1 ? err.message.slice(0, loc) : err.message;
    throw new Error(errMsg);
  }
};

export const getBalanceUsdt = async (privateKey, address) => {
  try {
    const signer = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(signer);
    return await new Promise((resolve, reject) => {
      usdtContract.methods.balanceOf(address).call((error, balance) => {
        if (error) return reject(error);
        balance = balance / (10 ** 6); // TODO: check calculator
        return resolve(balance);
      });
    });
  } catch (err) {
    const loc = err.message.indexOf('at runCall');
    const errMsg = loc > -1 ? err.message.slice(0, loc) : err.message;
    throw new Error(errMsg);
  }
};

export const getInfoEthTransaction = async (trans) => {
  const { confirmations, hash, timeStamp } = trans;
  const value = web3.utils.fromWei(trans.value);
  const cumulativeGasUsed = web3.utils.toBN(trans.cumulativeGasUsed).toNumber();
  const gasPrice = web3.utils.toBN(trans.gasPrice).toNumber();
  const gas = web3.utils.toBN(trans.gas).toNumber();
  let gasUsed = cumulativeGasUsed < gas ? gasPrice * cumulativeGasUsed : gasPrice * gas;
  gasUsed = Number(web3.utils.fromWei(gasUsed.toString()));

  return { coin: 'eth', hash, value, valueUSD: null, gasUsed, confirmations, createdAt: moment(timeStamp * 1000) };
};

export const getInfoUsdtTransaction = (trans) => {
  const { confirmations, tokenDecimal, hash, timeStamp } = trans;
  const value = web3.utils
    .toBN(trans.value)
    .div(web3.utils.toBN(10).pow(web3.utils.toBN(tokenDecimal)))
    .toNumber();
  const gasPrice = web3.utils.toBN(trans.gasPrice).toNumber();
  let gasUsed = web3.utils.toBN(trans.gasUsed).toNumber() * gasPrice;
  gasUsed = Number(web3.utils.fromWei(gasUsed.toString()));

  return { coin: 'usdt', hash, value, valueUSD: value, gasUsed, confirmations, createdAt: moment(timeStamp * 1000) };
};

export const sendEth = async (privateKey, fromAddress, toAddress, amount) => {
  try {
    const signer = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(signer);
    const sendParams = {
      from: fromAddress,
      to: toAddress,
      value: web3.utils.toWei(amount),
      gas: 0
    };
    sendParams.gas = walletConstant.MAX_GAS_FOR_ETH_SEND;
    return await sendTransactionPromise(sendParams);
  } catch (err) {
    const loc = err.message.indexOf('at runCall');
    const errMsg = loc > -1 ? err.message.slice(0, loc) : err.message;
    throw new Error(errMsg);
  }
};

export const sendUsdt = async (privateKey, fromAddress, toAddress, amount, gasPriceDefault = '30') => {
  try {
    const signer = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(signer);
    // const gasPrice = await web3.eth.getGasPrice();
    const gasPrice = web3.utils.toWei(gasPriceDefault, 'Gwei');
    const sendParams = {
      from: fromAddress,
      value: '0x0',
      gasPrice,
      gas: walletConstant.MAX_GAS_FOR_TOKEN_SEND,
    };
    const tokenAmount = Math.round(Number(amount) * Math.pow(10, 6));

    return await sendTokenPromise(usdtContract, toAddress, tokenAmount, sendParams);
  } catch (err) {
    const loc = err.message.indexOf('at runCall');
    const errMsg = loc > -1 ? err.message.slice(0, loc) : err.message;
    throw new Error(errMsg);
  }
};

const sendTransactionPromise = (params) => {
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction(params, (err, data) => {
      if (err !== null) return reject(err);
      return resolve(data);
    });
  });
};

const sendTokenPromise = (tokenContract, sendToAddress, sendAmount, params) => {
  return new Promise((resolve, reject) => {
    tokenContract.methods.transfer(sendToAddress, sendAmount).send(params, (err, sendTx) => {
      if (err) return reject(err);
      return resolve(sendTx);
    });
  });
};