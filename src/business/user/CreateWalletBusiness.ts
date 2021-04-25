import config from '@src/config';
import walletConstant from '@src/config/wallet';
import UserWalletRepository from '@src/repository/UserWalletRepository';
import { generateString } from '@src/utils/helpers';
import { IUserWalletModel } from 'bo-trading-common/lib/models/userWallets';
import lightwallet from 'eth-lightwallet';
import Web3 from 'web3';

const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider(walletConstant.RPC_ADDRESS));

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
      const trc20Result = await tronWeb.createAccount();;
      const userWalletRes = new UserWalletRepository();
      const wallet = userWalletRes.create(<IUserWalletModel>{
        user_id: user.id,
        trc20: JSON.stringify(trc20Result)
      });
      return wallet;
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