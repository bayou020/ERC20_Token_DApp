/* eslint-disable @typescript-eslint/no-explicit-any */
import Web3 from 'web3';
import * as OwnERC20TokenJSON from '../../../build/contracts/OwnERC20Token.json'
import { OwnERC20Token } from '../../types/OwnERC20Token';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

export class OwnERC20TokenWrapper {
    web3: Web3;

    contract: OwnERC20Token;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(OwnERC20TokenJSON.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getTotalSupply() {
        const value = await this.contract.methods.totalSupply().call();
        return value;
    }

    async getTokenSymbol() {
        const value = await this.contract.methods.symbol().call();
        return value;
    }

    async getTokenName() {
        const value = await this.contract.methods.name().call();
        return value;
    }

    async setTransferToken(fromAddress: string, toAddress: string, amount: number) {
        const tx = await this.contract.methods
            .transfer(toAddress, this.web3.utils.toWei(this.web3.utils.toBN(amount)))
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress
            });

        return tx;
    }

    async deploy(fromAddress: string) {
        const deployTx = await (this.contract
            .deploy({
                data: OwnERC20TokenJSON.bytecode,
                arguments: []
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress,
                to: '0x0000000000000000000000000000000000000000'
            } as any) as any);

        this.useDeployed(deployTx.contractAddress);

        return deployTx.transactionHash;
    }

    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}