import { BankAccountType } from "./enums";

type Entry = {
    value: number;
    type: 'deposit' | 'withdrawal';
}

class EntrySpecificObj {
    value: number;
    type: 'deposit' | 'withdrawal';
    specificProperty?: string | null;

    constructor(value: number, type: 'deposit' | 'withdrawal') {
        this.value = value;
        this.type = type;
    }
}

export abstract class BankAccount {
    readonly book = new Array<Entry>();
    readonly type: BankAccountType;
    private _accNumber: string;
    private _balance: number = 0;
    constructor(
        accType: BankAccountType,
        accNumber: string,
        balance: number = 0
    ) {
        this.type = accType;
        this._accNumber = accNumber;
        this._balance = balance;
    }

    public get accNumber(): string {
        return this._accNumber;
    }

    public set accNumber(value: string) {
        this._accNumber = value;
    }

    public get balance(): number {
        return this._balance;
    }

    toString(): string {
        return `BANK ACCOUNT [Account Number: ${this._accNumber} |${this.type}|, Balance: ${this._balance}`;
    }

    deposit(amount: number): void {
        this._balance = this._balance + amount;
        let entry = new EntrySpecificObj(amount, 'deposit');
        entry.specificProperty = null;
        this.book.push(entry);
    }

    withdraw(amount: number): boolean {
        this._balance = this._balance - amount;
        this.book.push({ value: amount, type: 'withdrawal' });
        return true;
    }

    transferTo(otherAccount: BankAccount, amount: number): void {
        if (this.withdraw(amount)) {
            otherAccount.deposit(amount);
            console.log(
                `Transferred ${amount} from ${this._accNumber} to ${otherAccount.accNumber}`
            );
        } else {
            console.log(
                `Insufficient funds to transfer ${amount} from ${this._accNumber} to ${otherAccount.accNumber}`
            );
        }
    }

    logStatement(): void {
        console.log(`Statement for account ${this._accNumber}:`);
        console.log(this.book
            .map(
                (entry) =>
                    `${entry.type === 'deposit' ? '+' : '-'} ${entry.value}`
            )
            .join('\n')
        );
    }
}

export interface InvestmentAccount {
    funds: number;
    invest(amount: number): void;
    withdrawInvestment(): number;
}

export class SavingsAccount extends BankAccount {
    constructor(accNumber: string, balance: number = 0) {
        super(BankAccountType.SAVINGS, accNumber, balance);
    }

    withdraw(amount: number): boolean {
        if (amount > this.balance) {
            console.log(
                `Withdrawal of ${amount} exceeds balance of ${this.balance}. Withdrawal denied.`
            );
            return false;
        } else {
            super.withdraw(amount);
            return true;
        }
    }

    toString(): string {
        return `[SAVING! Account Number: ${this.accNumber} |${this.type}|, Balance: ${this.balance}]`;
    }
}

export class CheckingAccount extends BankAccount {
    constructor(accNumber: string, balance: number = 0) {
        super(BankAccountType.CHECKING, accNumber, balance);
    }

    toString(): string {
        return `[CHECKING! Account Number: ${this.accNumber} |${this.type}|, Balance:${this.balance}]`;
    }
}

type BankAccountConstructor<T> = new (...args: any[]) => T;
export function withOverdraftLimit<C extends BankAccountConstructor<BankAccount>>(
    Class: C,
    limit: number = 0
) {
    return class extends Class {
        private _overdraftLimit: number;

        constructor(...args: any[]) {
            super(...args);
            this._overdraftLimit = limit;
        }

        withdraw(amount: number): boolean {
            if (amount > this.balance + this._overdraftLimit) {
                console.log(
                    `Withdrawal of ${amount} exceeds balance of ${this.balance} + limit ${this._overdraftLimit}. Withdrawal denied.`
                );
                return false;
            } else {
                super.withdraw(amount);
                return true;
            }
        }
    };
}

export class VipAccount extends BankAccount implements InvestmentAccount {
    constructor(accNumber: string, balance: number = 0) {
        super(BankAccountType.CHECKING, accNumber, balance);
    }

    funds: number = 0;
    invest(amount: number): void {
        this.funds = this.funds + amount;
    }

    withdrawInvestment(): number {
        const amount = this.funds;
        this.funds = 0;

        return amount;
    }
}



