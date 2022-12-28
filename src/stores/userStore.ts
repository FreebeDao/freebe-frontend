import type { UserBaseInfo } from '@/types/User';
import { defineStore } from 'pinia';
import type { Status } from '@/types/Status';
import { AxiosError } from 'axios';
import { UserAPI } from '@/api/Login/LoginAPI';
import { ethers } from "ethers";


type States = {
  // 用户信息
  profile: {
    // 记录用户信息
    result: Partial<UserBaseInfo>;
    // 记录登录请求的请求状态
    status: Status;
    // 记录登录失败的错误信息
    error: string;
  };
};

type Getters = {};
type Actions = {
  login(arg: UserBaseInfo): Promise<void>;
};
const contractAddress = "0x802C257Db565a6b0D1cdD4C7D876a70f3C97bd66"
const abi = [
  {
    "inputs": [
      {
        "internalType": "contract Dao",
        "name": "thedao",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      }
    ],
    "name": "claimTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_daoDomain",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_daoName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_daoLogo",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_daoMission",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "_daoColor",
        "type": "uint8"
      }
    ],
    "name": "createDao",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract Dao",
        "name": "thedao",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_objective",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_results",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_deadline",
        "type": "uint256"
      }
    ],
    "name": "createTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "when",
        "type": "uint256"
      }
    ],
    "name": "Withdrawal",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getDaoList",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "daoDomain",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "daoName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "daoLogo",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "daoMission",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "daoColor",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "daoCreater",
            "type": "address"
          }
        ],
        "internalType": "struct baseDao[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract Dao",
        "name": "thedao",
        "type": "address"
      }
    ],
    "name": "getTaskList",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "objective",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "results",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "builder",
            "type": "address"
          }
        ],
        "internalType": "struct task[]",
        "name": "_taskList",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_domain",
        "type": "string"
      }
    ],
    "name": "searchDomian",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
const provider = new ethers.providers.Web3Provider((window as any).ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);
const contractAsSigner = contract.connect(signer);
export const useUserStore = defineStore<'user', States, Getters, Actions>('user', {
  state: () => ({
    profile: {
      result: {},
      status: 'idle',
      error: '',
    },
  }),
  actions: {
    async login(arg) {
      this.profile.status = 'loading';
      try {
        const response = await UserAPI.getUserLogin(arg);
        console.log(response);

        if (response.message == "success") {
          this.profile.status = 'success';
          this.profile.result = arg;
          this.profile.result.head_image === "test" ? this.profile.result.head_image = "http://free-be.xyz/static/metamask_wallet_element.3f2fbdea.svg" : ""
          return
        }
      } catch (error) {
        this.profile.status = 'error';
        if (error instanceof AxiosError) {
          this.profile.error = error.response?.data.message;
        } else if (error instanceof Error) {
          this.profile.error = error.message;
        }
      }
    }

  },
  persist: true,
});
